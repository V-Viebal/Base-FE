import {
	NgModule
} from '@angular/core';
import {
	RouterModule,
	Routes
} from '@angular/router';

import {
	IRouteData
} from '@core';

import {
	SignOutComponent,
	SignInComponent
} from './components';
import {
	CONSTANT
} from './resources';

const routeData: IRouteData = { cache: false };
const routes: Routes = [
	{
		path: CONSTANT.PATH.SIGN_IN,
		component: SignInComponent,
		data: routeData,
	},
	{
		path: CONSTANT.PATH.SIGN_OUT,
		component: SignOutComponent,
		data: routeData,
	},
];

@NgModule({
	imports: [ RouterModule.forChild( routes ) ],
	exports: [ RouterModule ],
})
export class AuthRoutingModule {}
