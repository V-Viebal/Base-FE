import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
	CoreModule,
	I18nLazyTranslateModule
} from '@core';

import { CUBAvatarModule } from '@cub/material/avatar';
import { CUBDividerModule } from '@cub/material/divider';
import { CUBIconModule } from '@cub/material/icon';
import { CUBButtonModule } from '@cub/material/button';
import { CUBMenuModule } from '@cub/material/menu';
import { CUBLoadingModule } from '@cub/material/loading';
import { CUBImageModule } from '@cub/material/image';


import { FooterComponent } from './components';
import { PhoneFormatPipe } from '@main/base/modules/common/pipes/phone-format.pipe';

@NgModule({
	imports: [
		CoreModule,
		RouterModule,

		I18nLazyTranslateModule.forChild({
			prefix: 'FOOTER',
			loader: ( lang: string ) =>
				import( `./i18n/${lang}.json` ),
		}),

		CUBDividerModule,
		CUBIconModule,
		CUBButtonModule,
		CUBAvatarModule,
		CUBMenuModule,
		CUBLoadingModule,
		CUBImageModule,

		PhoneFormatPipe,
	],
	exports	: [ FooterComponent ],
	declarations: [ FooterComponent ],
	providers: [],
})
export class FooterModule {}
