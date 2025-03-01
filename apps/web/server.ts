import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { RequestHandler } from 'express';
import { join } from 'path';
import compression from 'compression';

// Import the Angular server module from main.server.ts
import { AppServerModule } from './src/main.server';
import './src/polyfills.server'; // if you have server-side polyfills

export function app(): express.Express {
	const server = express();
	const isProduction = process.env.NODE_ENV === 'production';
	const distFolder
		= join(
			process.cwd(),
			isProduction ? '/app/dist/production/browser' : '../../dist/web/browser'
		);
	// Adjust if your browser build goes elsewhere

	const indexHtml = join(distFolder, 'index.html');
	const commonEngine = new CommonEngine();

	// Set up Gzip compression
	server.use(compression() as RequestHandler);

	// Serve static files
	server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

	// Example prerendered route
	server.get('/', (_req, res) => {
		res.sendFile(indexHtml, (err) => {
			if (err) {
				console.error('Error sending file for "/" route:', err);
				res.status(500).end();
			}
		});
	});

	// All other routes -> Angular SSR
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
	const port = process.env.PORT || 4000;
	const server = app();

	server
		.listen(port, () => {
			console.log(
				`Node Express server listening on http://localhost:${port}`
			);
		})
		.on('error', (err) => {
			console.error('Server error:', err);
		});
}

if (require.main === module) {
	run();
}
