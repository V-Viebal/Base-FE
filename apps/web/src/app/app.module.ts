import {
	ModuleWithProviders,
	NgModule,
	inject
} from '@angular/core';
import {
	BrowserModule
} from '@angular/platform-browser';
import {
	ServiceWorkerModule as SWModule
} from '@angular/service-worker';
import {
	provideAnimationsAsync
} from '@angular/platform-browser/animations/async';
import {
	HTTP_INTERCEPTORS
} from '@angular/common/http';

import {
	CONSTANT,
	CoreModule,
	I18nLazyTranslateModule,
	ServiceWorkerService
} from '@core';

import {
	CUB_FILE_SERVICE,
	CUB_LOCAL_FILE_SIZE_LIMIT
} from '@cub/material/file-picker';
import {
	CUBImageModule
} from '@cub/material';

import {
	ErrorModule
} from '@error/error.module';

import {
	FileService
} from '@main/common/shared/services';
import {
	AuthModule
} from '@main/auth/auth.module';
import {
	AuthInterceptor
} from '@main/auth/interceptors';

import {
	AppRoutingModules
} from './app-routing.module';
import {
	AppComponent
} from './app.component';

// eslint-disable-next-line @typescript-eslint/naming-convention
const ServiceWorkerModule: ModuleWithProviders<SWModule>
	= SWModule.register(
		'ngsw-worker.js',
		{ enabled: process.env.ENV_NAME === 'prod' }
	);

@NgModule({
	imports: [
		CoreModule,
		BrowserModule,

		I18nLazyTranslateModule.forRoot({
			prefix: 'APP',
			loader: ( lang: string ) =>
				import( `./i18n/${lang}.json` ),
		}),

		CUBImageModule,

		ErrorModule,
		AuthModule,

		AppRoutingModules,

		ServiceWorkerModule,
	],
	declarations: [
		AppComponent,
	],
	providers: [
		{
			provide: CUB_FILE_SERVICE,
			useClass: FileService,
		},
		{
			provide: CUB_LOCAL_FILE_SIZE_LIMIT,
			useValue: CONSTANT.ALLOW_FILE_SIZE,
		},
		provideAnimationsAsync(),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
	bootstrap: [ AppComponent ],
})
export class AppModule {

	private _serviceWorkerService: ServiceWorkerService
		= inject( ServiceWorkerService );

	constructor() {
		// Update available version
		this._serviceWorkerService.updateAvailableVersion();
	}

}
