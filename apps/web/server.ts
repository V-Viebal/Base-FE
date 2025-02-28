import 'zone.js/node'; // Required for Angular SSR
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { RequestHandler } from 'express';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import compression from 'compression';

import './src/polyfills.server';

export function app(): express.Express {
	const server = express();
	const isProduction = process.env.NODE_ENV === 'production';
	const distFolder = join(
		process.cwd(),
		isProduction ? '/app/dist/production/browser' : '../../dist/web/browser'
	);
	const indexHtml = join(distFolder, 'index.html');

	const commonEngine = new CommonEngine();

	server.set('view engine', 'html');
	server.set('views', distFolder);

	// Use Gzip compression for all HTTP responses
	server.use(compression() as RequestHandler);

	// Serve static files from /browser with caching
	server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

	// Define prerendered static routes
	const prerenderedRoutes = ['']; // Add more routes like '/about' if needed
	prerenderedRoutes.forEach((route) => {
		server.get(route, (_req, res) => {
			res.sendFile(join(distFolder, 'index.html'), (err) => {
				if (err) {
					console.error(
						`Failed to send file for route ${route}:`,
						err
					);
					res.status(500).end();
				}
			});
		});
	});

	server.get('*', (req, res, next) => {
		const { protocol, headers, originalUrl, baseUrl } = req;
		const host = headers.host || 'localhost';
		const fullUrl = `${protocol}://${host}${originalUrl}`;

		commonEngine
			.render({
				bootstrap: AppServerModule,
				documentFilePath: indexHtml,
				url: fullUrl,
				publicPath: distFolder,
				providers: [
					{ provide: APP_BASE_HREF, useValue: baseUrl || '/' },
				],
			})
			.then((html) => res.send(html))
			.catch((err) => {
				console.error('SSR rendering error:', err);
				next(err);
			});
	});

	return server;
}

function run(): void {
	const port = process.env.PORT || 4000; // Allow port to be configured via env

	const server = app();

	server
		.listen(port, () => {
		})
		.on('error', (err: NodeJS.ErrnoException) => {
			if (err.code === 'EADDRINUSE') {
				console.error(
					`Port ${port} is already in use. Try a different port.`
				);
			} else {
				console.error('Server startup error:', err);
			}
		});
}

// Run only if executed directly (not imported)
if (require.main === module) {
	run();
}

export * from './src/main.server';
