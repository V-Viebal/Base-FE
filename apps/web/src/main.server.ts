import './polyfills.server';

import { enableProdMode } from '@angular/core';

if (process.env.NODE_ENV === 'production') {
	enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
