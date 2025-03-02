import {
	NgModule,
	PLATFORM_ID
} from '@angular/core';

import {
	CoreModule,
	I18nLazyTranslateModule
} from '@core';

import {
	CUBButtonModule
} from '@cub/material';

import {
	ErrorComponent
} from './components';
import {
	routing
} from './error.routing';
import {
	ErrorService
} from './services';
import {
	CustomTranslateLoader
} from 'app/custom-translate-loader';

@NgModule({
	imports: [
		CoreModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'ERROR',
			loader: (lang: string) => {
				const loader = new CustomTranslateLoader(PLATFORM_ID);
				return loader.getTranslation(lang).toPromise();
			}
		}),

		CUBButtonModule,

		routing,
	],
	exports		: [ ErrorComponent ],
	declarations: [ ErrorComponent ],
	providers	: [ ErrorService ],
})
export class ErrorModule {}
