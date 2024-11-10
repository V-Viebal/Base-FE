import { NgModule } from '@angular/core';

import {
	CoreModule,
	FormModule,
	I18nLazyTranslateModule
} from '@core';

import {
	TableModule
} from 'primeng/table';
import {
	ToolbarModule
} from 'primeng/toolbar';
import {
	ButtonModule
} from 'primeng/button';
import {
	MultiSelectModule
} from 'primeng/multiselect';

import {
	CUBButtonModule,
	CUBConfirmModule,
	CUBDividerModule,
	CUBDropdownModule,
	CUBEditorModule,
	CUBFilePickerModule,
	CUBFormFieldModule,
	CUBMenuModule,
	CUBPopupModule,
	CUBScrollBarModule,
	CUBToastModule
} from '@cub/material';

import {
	OperationComponent
} from './components';
import {
	OperationRoutingModule
} from './operation-routing.module';
import {
	OperationService
} from './services';
import {
	TypeTranslatePipe
} from './pipes';

@NgModule({
	imports: [
		CoreModule,
		FormModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'OPERATION',
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
		CUBMenuModule,

		OperationRoutingModule,

		ButtonModule,
		ToolbarModule,
		TableModule,
		MultiSelectModule,
	],
	exports: [
		OperationComponent,
		TypeTranslatePipe,
	],
	declarations: [
		OperationComponent,
		TypeTranslatePipe,
	],
	providers: [
		OperationService,
	],
})
export class OperationModule {}
