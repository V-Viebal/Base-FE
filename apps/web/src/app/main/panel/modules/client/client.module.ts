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
	ClientComponent
} from './components';
import {
	ClientRoutingModule
} from './client-routing.module';
import {
	ClientService
} from './services';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@NgModule({
	imports: [
		CoreModule,
		FormModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'CLIENT',
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

		ClientRoutingModule,

		ButtonModule,
		ToolbarModule,
		TableModule,
	],
	exports: [
		ClientComponent,
	],
	declarations: [
		ClientComponent,
	],
	providers: [
		ClientService,
	],
})
export class ClientModule {}
