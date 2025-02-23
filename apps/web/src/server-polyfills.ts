import domino from 'domino';

const template = '<!doctype html><html><head></head><body></body></html>';
const win = domino.createWindow(template);

(global as any).window = win;
(global as any).document = win.document;
Object.defineProperty(global, 'navigator', {
	value: win.navigator,
	writable: true,
	configurable: true,
});

// Optional: polyfill self and customElements if needed
if (typeof self === 'undefined') {
	(global as any).self = global;
}
if (typeof customElements === 'undefined') {
	(global as any).customElements = {
		define: () => {},
		get: () => undefined,
		whenDefined: () => Promise.resolve(),
	};
}

// Polyfill localStorage if needed
if (typeof localStorage === 'undefined') {
	(global as any).localStorage = {
		getItem: (_key: string) => null,
		setItem: (_key: string, _value: string) => {},
		removeItem: (_key: string) => {},
		clear: () => {},
	};
}
