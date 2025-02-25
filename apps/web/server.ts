import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { RequestHandler } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import compression from 'compression';
import { ENVIRONMENT } from './src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
	const server = express();
	const distFolder = join(
		process.cwd(),
		ENVIRONMENT.PRODUCTION ? 'dist/production/browser' : '../../dist/web/browser'
	);
	const indexHtml = existsSync(join(distFolder, 'index.original.html'))
		? join(distFolder, 'index.original.html')
		: join(distFolder, 'index.html');

	const commonEngine = new CommonEngine();

	server.set('view engine', 'html');
	server.set('views', distFolder);

	// Use Gzip compression for all HTTP responses
	server.use(compression() as RequestHandler);

	// Serve static files from /browser
	server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

	// Define prerendered static routes
	const prerenderedRoutes = [''];
	prerenderedRoutes.forEach((route) => {
		server.get(route, (_req, res) => {
			res.sendFile(join(distFolder, 'index.html'));
		});
	});

	// Use SSR for other routes
	server.get('*', (req, res, next) => {
		const { protocol, headers, originalUrl, baseUrl } = req;
		const host = headers.host;
		const fullUrl = `${protocol}://${host}${originalUrl}`;

		commonEngine
			.render({
				bootstrap: AppServerModule,
				documentFilePath: indexHtml,
				url: fullUrl,
				publicPath: distFolder,
				providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
			})
			.then((html) => res.send(html))
			.catch((err) => next(err));
	});

	return server;
}

function run(): void {
	const port = process.env['PORT'] || 4000;
	const server = app();
	server.listen(port, () => {
		console.log(
			`Node Express server listening on http://localhost:${port}`
		);
	});
}

// Ensure the server is run only when this file is executed directly.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule ? mainModule.filename : '';
if (
	moduleFilename === __filename ||
	(moduleFilename && moduleFilename.indexOf('iisnode') !== -1)
) {
	run();
}

export default AppServerModule;
