import './server-polyfills';

import { enableProdMode } from '@angular/core';

if (process.env.NODE_ENV === 'production') {
	enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
