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
	CONSTANT as OPERATION_CONSTANT
} from './modules/operation/resources';
import {
	CONSTANT as NEWS_CONSTANT
} from './modules/news/resources';
import {
	CONSTANT as CLIENT_CONSTANT
} from './modules/client/resources';
import {
	CONSTANT as CONFIG_CONSTANT
} from './modules/config/resources';
import {
	PanelComponent
} from './components/panel.component';
import {
	AuthGuard
} from '@main/auth/guards';

export const routes: Routes = [
	{
		path				: '',
		component			: PanelComponent,
		canActivateChild	: [ AuthGuard ],
		children			: [
			{
				path		: '',
				redirectTo	: OPERATION_CONSTANT.PATH.MAIN,
				pathMatch: 'full',
			},
			{
				path		: OPERATION_CONSTANT.PATH.MAIN,
				loadChildren: () =>
					import( './modules/operation/operation.module' )
					.then( ( m: any ) => m.OperationModule ),
				data		: { preload: true },
			},
			{
				path		: CLIENT_CONSTANT.PATH.MAIN,
				loadChildren: () =>
					import( './modules/client/client.module' )
					.then( ( m: any ) => m.ClientModule ),
				data		: { preload: true },
			},
			{
				path		: NEWS_CONSTANT.PATH.MAIN,
				loadChildren: () =>
					import( './modules/news/news.module' )
					.then( ( m: any ) => m.NewsModule ),
				data		: { preload: true },
			},
			{
				path		: CONFIG_CONSTANT.PATH.MAIN,
				loadChildren: () =>
					import( './modules/config/config.module' )
					.then( ( m: any ) => m.ConfigModule ),
				data		: { preload: true },
			},
		],
	},
];

@NgModule({
	imports: [ I18nLazyRouterModule.forChild( routes ) ],
	exports: [ I18nLazyRouterModule ],
})
export class PanelRoutingModule {}
