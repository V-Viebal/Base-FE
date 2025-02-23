import {
	NgModule
} from '@angular/core';

import {
	CoreModule,
	I18nLazyTranslateModule
} from '@core';

import {
	CUBButtonModule
} from '@cub/material';

import {
	ErrorComponent
} from './components';
import {
	routing
} from './error.routing';
import {
	ErrorService
} from './services';

@NgModule({
	imports: [
		CoreModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'ERROR',
			loader: ( lang: string ) => {
				const translations = require(`./i18n/${lang}.json`);
				return Promise.resolve( translations );
			}
		}),

		CUBButtonModule,

		routing,
	],
	exports		: [ ErrorComponent ],
	declarations: [ ErrorComponent ],
	providers	: [ ErrorService ],
})
export class ErrorModule {}
