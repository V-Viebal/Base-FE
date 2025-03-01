
import './polyfills.server';

// Use server of native executor
import { AppServerModule } from './app/app.server.module';
import { enableProdMode } from '@angular/core';

if ( process.env.ENV_NAME === 'prod' ) {
	enableProdMode();
}

// Use custom server
import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { RequestHandler } from 'express';
import { join } from 'node:path';
import compression from 'compression';

export function app(): express.Express {
	const server = express();
	const isProduction = process.env.ENV_NAME === 'prod';
	const distFolder = join(
		process.cwd(),
		isProduction ? '/app/dist/production/browser' : '../../dist/web/browser'
	);
	// Adjust the path if your browser build output is elsewhere

	const indexHtml = join( distFolder, 'index.html' );
	const commonEngine = new CommonEngine();

	// Set view engine and views directory
	server.set( 'view engine', 'html' );
	server.set( 'views', distFolder );

	// Use Gzip compression for all HTTP responses
	server.use( compression() as RequestHandler );

	// Serve static files from the browser build folder
	server.get( '*.*', express.static( distFolder, { maxAge: '1y' } ) );

	// Define prerendered static routes
	const prerenderedRoutes = [''];
	prerenderedRoutes.forEach( ( route ) => {
		server.get( route, ( _req, res ) => {
			res.sendFile( join( distFolder, 'index.html' ) );
		});
	});

	// Use SSR for all other routes
	server.get( '*', ( req, res, next ) => {
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
			.then( ( html ) => res.send( html ) )
			.catch( ( err ) => next( err ) );
	});

	return server;
}

export function run(): void {
	const port = process.env.PORT || 4000;
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
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './app/app.server.module';
