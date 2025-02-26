/***************************************************************************************************
 * Main Entry Point for Angular Client-Side Application
 * Bootstraps the AppModule for browser execution, handling client-side rendering in SSR setups.
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

if ( process.env.NODE_ENV === 'production' ) {
	enableProdMode();
}

/**
 * Bootstrap the Angular application in the browser.
 * This runs on the client-side after SSR or prerendering has completed.
 */
platformBrowserDynamic()
.bootstrapModule(AppModule)
.then(() => {
	// Register the service worker only in production and if supported
	if ( 'serviceWorker' in navigator &&  process.env.NODE_ENV === 'production' ) {
		navigator.serviceWorker.register('./ngsw-worker.js');
	}
})
.catch((err: Error) =>
	console.error('Error bootstrapping Angular app:', err)
);
