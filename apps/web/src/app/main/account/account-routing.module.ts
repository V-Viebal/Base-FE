import {
	NgModule
} from '@angular/core';
import {
	Routes
} from '@angular/router';

import {
	I18nLazyRouterModule,
	IRouteData
} from '@core';

import {
	CONSTANT
} from './resources';

// import { AuthGrantService } from '../auth/services';

const routeData: IRouteData = { cache: false };
const routes: Routes = [
	{
		path		: CONSTANT.PATH.MAIN,
		// canActivate	: [ AuthGrantService ],
		data		: routeData,
	},
];

@NgModule({
	imports: [ I18nLazyRouterModule.forChild( routes ) ],
	exports: [ I18nLazyRouterModule ],
})
export class AccountRoutingModules {}
