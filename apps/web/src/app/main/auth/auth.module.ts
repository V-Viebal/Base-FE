import {
	NgModule
} from '@angular/core';
import {
	PlatformModule
} from '@angular/cdk/platform';

import {
	CoreModule,
	FormModule,
	I18nLazyTranslateModule
} from '@core';

import {
	CUBFormFieldModule
} from '@cub/material/form-field';
import {
	CUBButtonModule
} from '@cub/material/button';
import {
	CUBIconModule
} from '@cub/material/icon';
import {
	CUBLoadingModule
} from '@cub/material/loading';
import {
	CUBToastModule
} from '@cub/material/toast';
import {
	CUBTooltipModule
} from '@cub/material/tooltip';
import {
	CUBPalettePipe
} from '@cub/pipes';

import {
	AuthRoutingModule
} from './auth-routing.module';
import {
	ResetPasswordComponent,
	SignInComponent
} from './components';

@NgModule({
	imports: [
		PlatformModule,

		CoreModule,
		FormModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'AUTH',
			loader: ( lang: string ) => import( `./i18n/${lang}.json` ),
		}),

		CUBButtonModule,
		CUBFormFieldModule,
		CUBLoadingModule,
		CUBIconModule,
		CUBToastModule,
		CUBTooltipModule,
		CUBPalettePipe,

		AuthRoutingModule,
	],
	exports: [
		ResetPasswordComponent,
		SignInComponent,
	],
	declarations: [
		ResetPasswordComponent,
		SignInComponent,
	],
})
export class AuthModule {}
