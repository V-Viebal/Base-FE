import {
	NgModule
} from '@angular/core';
import {
	RouterModule,
	Routes
} from '@angular/router';

import {
	ErrorComponent
} from '@error/components';

import {
	IRouteData
} from '@core';

import {
	CustomPreloadingStrategy
} from './custom-preloading-strategy';
import {
	CONSTANT as PANEL_CONSTANT
} from './main/panel/resources';

const routeData: IRouteData = { cache: false };
const routes: Routes = [
	{
		path		: '',
		loadChildren: () =>
			import( './main/base/base.module' )
			.then( ( m: any ) => m.BaseModule ),
		data		: { preload: true, ...routeData },
	},
	{
		path		: PANEL_CONSTANT.PATH.MAIN,
		loadChildren: () =>
			import( './main/panel/panel.module' )
			.then( ( m: any ) => m.PanelModule ),
		data		: { preload: true, ...routeData },
	},
	{
		path		: '**',
		component	: ErrorComponent,
		data		: routeData,
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			routes,
			{
				preloadingStrategy: CustomPreloadingStrategy,
				scrollPositionRestoration: 'enabled',
				enableViewTransitions: true,
			}
		),
	],
	exports		: [ RouterModule ],
	providers	: [ CustomPreloadingStrategy ],
})
export class AppRoutingModules {}
