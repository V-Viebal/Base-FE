/***************************************************************************************************
 * Server-Side Polyfills for Angular SSR
 * These polyfills create a browser-like environment on the server for Angular SSR and prerendering.
 * Uses 'domino' to simulate DOM APIs in Node.js.
 */

import domino from 'domino';

// Create a minimal DOM environment using domino
const template = '<!doctype html><html><head></head><body></body></html>';
const win = domino.createWindow(template);

// Set up global objects for Angular SSR
(global as any).window = win;
(global as any).document = win.document;
(global as any).navigator = win.navigator;

// Polyfill `self` for compatibility with certain libraries or Angular internals
if (typeof self === 'undefined') {
	(global as any).self = global;
}

// Polyfill `customElements` as a no-op if not available
if (typeof customElements === 'undefined') {
	(global as any).customElements = {
		define: () => {},
		get: () => undefined,
		whenDefined: () => Promise.resolve(),
	};
}

// Polyfill `localStorage` as a simple in-memory store (optional, only if your app uses it)
if (typeof localStorage === 'undefined') {
	let storage: { [key: string]: string } = {};
	(global as any).localStorage = {
		getItem: (key: string) => storage[key] || null,
		setItem: (key: string, value: string) => {
			storage[key] = value;
		},
		removeItem: (key: string) => {
			delete storage[key];
		},
		clear: () => {
			storage = {};
		},
	};
}

// Polyfill `MediaSession` to prevent errors during SSR (optional, only if your app uses it)
if (!navigator.mediaSession) {
	(navigator as any).mediaSession = {
		setActionHandler: (action: string) => {
			console.warn(
				`MediaSession.setActionHandler for "${action}" is not implemented in SSR.`
			);
		},
		clearActionHandler: (action: string) => {
			console.warn(
				`MediaSession.clearActionHandler for "${action}" is not implemented in SSR.`
			);
		},
	};
}
