import { NgModule } from '@angular/core';

import {
	CoreModule,
	FormModule,
	I18nLazyTranslateModule
} from '@core';

import {
	CUBButtonModule,
	CUBConfirmModule,
	CUBDividerModule,
	CUBDropdownModule,
	CUBEditorModule,
	CUBFilePickerModule,
	CUBFormFieldModule,
	CUBPopupModule,
	CUBScrollBarModule,
	CUBToastModule
} from '@cub/material';

import {
	NewsComponent
} from './components';
import {
	NewsRoutingModule
} from './news-routing.module';
import {
	NewsService
} from './services';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
	imports: [
		CoreModule,
		FormModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'NEWS',
			loader: ( lang: string ) =>
				import( `./i18n/${lang}.json` ),
		}),

		CUBEditorModule,
		CUBFormFieldModule,
		CUBButtonModule,
		CUBDropdownModule,
		CUBToastModule,
		CUBConfirmModule,
		CUBPopupModule,
		CUBDividerModule,
		CUBScrollBarModule,
		CUBFilePickerModule,

		NewsRoutingModule,

		ButtonModule,
		ToolbarModule,
		TableModule,
	],
	exports: [
		NewsComponent,
	],
	declarations: [
		NewsComponent,
	],
	providers: [
		NewsService,
	],
})
export class NewsModule {}
