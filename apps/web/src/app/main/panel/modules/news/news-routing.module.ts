import {
	NgModule
} from '@angular/core';
import {
	Routes
} from '@angular/router';

import {
	I18nLazyRouterModule
} from '@core';

import {
	NewsComponent
} from './components';

export const routes: Routes = [
	{
		path		: '',
		component	: NewsComponent,
	},
];

@NgModule({
	imports: [ I18nLazyRouterModule.forChild( routes ) ],
	exports: [ I18nLazyRouterModule ],
})
export class NewsRoutingModule {}
