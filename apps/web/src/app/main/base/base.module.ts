import {
	NgModule
} from '@angular/core';

import {
	CoreModule,
	FormModule,
	I18nLazyTranslateModule
} from '@core';

import {
	CUBImageModule,
	CUBLoadingModule,
	CUBScrollBarModule,
	CUBToastModule
} from '@cub/material';

import {
	BaseComponent
} from './components';
import {
	BaseRoutingModule
} from './base-routing.module';
import {
	BaseService
} from './services';

@NgModule({
	imports: [
		CoreModule,
		FormModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'BASE',
			loader: ( lang: string ) => {
				const translations = require(`./i18n/${lang}.json`);
				return Promise.resolve( translations );
			}
		}),

		CUBImageModule,
		CUBLoadingModule,
		CUBToastModule,
		CUBScrollBarModule,

		BaseRoutingModule,
	],
	exports: [
		BaseComponent,
	],
	declarations: [
		BaseComponent,
	],
	providers: [
		BaseService,
	],
})
export class BaseModule {}
