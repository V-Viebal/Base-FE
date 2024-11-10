import { NgModule } from '@angular/core';

import {
	CoreModule,
	FormModule,
	I18nLazyTranslateModule
} from '@core';

import {
	CUBButtonModule
} from '@cub/material/button';
import {
	CUBImageModule
} from '@cub/material/image';
import {
	CUBLoadingModule
} from '@cub/material/loading';
import {
	CUBFormFieldModule,
	CUBShowMoreModule,
	CUBToastModule
} from '@cub/material';

import {
	HomeComponent
} from './components';
import {
	HomeRoutingModule
} from './home-routing.module';

@NgModule({
	imports: [
		CoreModule,
		FormModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'HOME',
			loader: ( lang: string ) =>
				import( `./i18n/${lang}.json` ),
		}),

		CUBFormFieldModule,
		CUBImageModule,
		CUBLoadingModule,
		CUBToastModule,
		CUBButtonModule,
		CUBShowMoreModule,

		HomeRoutingModule,
	],
	exports: [
		HomeComponent,
	],
	declarations: [
		HomeComponent,
	],
	providers: [],
})
export class HomeModule {}
