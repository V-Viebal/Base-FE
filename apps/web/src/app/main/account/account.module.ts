import {
	NgModule,
	PLATFORM_ID
} from '@angular/core';

import {
	CoreModule,
	I18nLazyTranslateModule
} from '@core';

import {
	AccountRoutingModules
} from './account-routing.module';
import {
	CustomTranslateLoader
} from 'app/custom-translate-loader';

@NgModule({
	imports: [
		CoreModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'ACCOUNT',
			loader: (lang: string) => {
				const loader = new CustomTranslateLoader(PLATFORM_ID);
				return loader.getTranslation(lang).toPromise();
			}
		}),

		AccountRoutingModules,
	],
	exports		: [],
	declarations: [],
	providers	: [],
})
export class AccountModule {}
