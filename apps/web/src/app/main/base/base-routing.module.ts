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
	BaseComponent
} from './components';

export const routes: Routes = [
	{
		path		: '',
		component	: BaseComponent,
		children	: [
			{
				path		: '',
				loadChildren: () =>
					import( './modules/home/home.module' )
					.then( ( m: any ) => m.HomeModule ),
				data		: { preload: true },
			},
		],
	},
];

@NgModule({
	imports: [ I18nLazyRouterModule.forChild( routes ) ],
	exports: [ I18nLazyRouterModule ],
})
export class BaseRoutingModule {}
