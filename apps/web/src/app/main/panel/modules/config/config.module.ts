import { NgModule } from '@angular/core';

import {
	CoreModule,
	FormModule,
	I18nLazyTranslateModule
} from '@core';

import {
	CUBButtonModule,
	CUBConfirmModule,
	CUBDropdownModule,
	CUBFormFieldModule,
	CUBLoadingModule,
	CUBScrollBarModule,
	CUBToastModule
} from '@cub/material';

import {
	ConfigComponent
} from './components';
import {
	ConfigRoutingModule
} from './config-routing.module';
import {
	ConfigService
} from './services';
import {
	ButtonModule
} from 'primeng/button';
import {
	ToolbarModule
} from 'primeng/toolbar';

@NgModule({
	imports: [
		CoreModule,
		FormModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'CONFIG',
			loader: ( lang: string ) =>
				import( `./i18n/${lang}.json` ),
		}),

		CUBFormFieldModule,
		CUBButtonModule,
		CUBDropdownModule,
		CUBToastModule,
		CUBConfirmModule,
		CUBScrollBarModule,
		CUBLoadingModule,

		ConfigRoutingModule,

		ButtonModule,
		ToolbarModule,
	],
	exports: [
		ConfigComponent,
	],
	declarations: [
		ConfigComponent,
	],
	providers: [
		ConfigService,
	],
})
export class ConfigModule {}
