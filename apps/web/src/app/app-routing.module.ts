import {
	NgModule
} from '@angular/core';
import {
	RouterModule,
	Routes,
	withInMemoryScrolling
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
				initialNavigation: 'enabledBlocking',
				useHash: false,
				...withInMemoryScrolling({
					scrollPositionRestoration: 'enabled',
					anchorScrolling: 'enabled',
				}),
			}
		),
	],
	exports		: [ RouterModule ],
	providers	: [ CustomPreloadingStrategy ],
})
export class AppRoutingModules {}
