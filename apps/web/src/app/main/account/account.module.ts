import {
	NgModule
} from '@angular/core';

import {
	CoreModule,
	I18nLazyTranslateModule
} from '@core';

import {
	AccountRoutingModules
} from './account-routing.module';

@NgModule({
	imports: [
		CoreModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'ACCOUNT',
			loader: ( lang: string ) => {
				const translations = require(`./i18n/${lang}.json`);
				return Promise.resolve( translations );
			}
		}),

		AccountRoutingModules,
	],
	exports		: [],
	declarations: [],
	providers	: [],
})
export class AccountModule {}
