import {
	NgModule
} from '@angular/core';
import {
	Routes
} from '@angular/router';
import {
	I18nLazyRouterModule
} from 'angular-core';

import {
	HomeComponent
} from './components';

export const routes: Routes = [
	{
		path		: '',
		component	: HomeComponent,
	},
];

@NgModule({
	imports: [ I18nLazyRouterModule.forChild( routes ) ],
	exports: [ I18nLazyRouterModule ],
})
export class HomeRoutingModule {}
