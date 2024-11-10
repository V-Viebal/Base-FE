import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit
} from '@angular/core';
import {
	Router
} from '@angular/router';

import {
	AuthService
} from '@main/auth/services';

import {
	CONSTANT
} from '../resources';
import {
	CONSTANT as AUTH_CONSTANT
} from '@main/auth/resources';
import {
	CONSTANT as OPERATION_CONSTANT
} from '../modules/operation/resources';
import {
	CONSTANT as NEWS_CONSTANT
} from '../modules/news/resources';
import {
	CONSTANT as CLIENT_CONSTANT
} from '../modules/client/resources';
import {
	CONSTANT as CONFIG_CONSTANT
} from '../modules/config/resources';

@Component({
	selector: 'panel',
	templateUrl: '../templates/panel.pug',
	styleUrls: ['../styles/panel.scss'],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent implements OnInit {

	protected isLoaded: boolean;
	protected isDrawerOpen: boolean = true;
	protected selectedItem: string;
	protected directionItems: any[];
	protected items: any[];

	private readonly _authService: AuthService
		= inject( AuthService );
	private _router: Router
		= inject( Router );

	constructor() {
		this.directionItems = [
			{
				value: OPERATION_CONSTANT.PATH.MAIN,
				icon: 'pi pi-info-circle',
				label: 'Dịch Vụ',
				command: () => {
					this.selectedItem = OPERATION_CONSTANT.PATH.MAIN;

					this._router.navigate([
						CONSTANT.PATH.MAIN + '/' + OPERATION_CONSTANT.PATH.MAIN,
					]);
				},
			},
			{
				value: NEWS_CONSTANT.PATH.MAIN,
				label: 'Tin Tức',
				icon: 'pi pi-inbox',
				command: () => {
					this.selectedItem = NEWS_CONSTANT.PATH.MAIN;

					this._router.navigate([
						CONSTANT.PATH.MAIN + '/' + NEWS_CONSTANT.PATH.MAIN,
					]);
				},
			},
			{
				value: CLIENT_CONSTANT.PATH.MAIN,
				label: 'Khách Hàng',
				icon: 'pi pi-address-book',
				command: () => {
					this.selectedItem = CLIENT_CONSTANT.PATH.MAIN;

					this._router.navigate([
						CONSTANT.PATH.MAIN + '/' + CLIENT_CONSTANT.PATH.MAIN,
					]);
				},
			},
			{
				value: CONFIG_CONSTANT.PATH.MAIN,
				label: 'Cài đặt',
				icon: 'pi pi-cog',
				command: () => {
					this.selectedItem = CONFIG_CONSTANT.PATH.MAIN;

					this._router.navigate([
						CONSTANT.PATH.MAIN + '/' + CONFIG_CONSTANT.PATH.MAIN,
					]);
				},
			},
		];

		this.items
			= [
				{
					icon: 'pi pi-home',
					label: 'Trang Chủ',
					command: () => {
						this._router.navigateByUrl( '/' );
					},
				},
				{
					icon: 'pi pi-sign-out',
					label: 'Đăng xuất',
					command: () => {
						this._authService.signout();
						this._router.navigate([ AUTH_CONSTANT.PATH.SIGN_IN ]);
					},
				},
			];
	}

	ngOnInit(): void {
		const path: string[] = window.location.pathname.split( '/' );
		const location: string = path[ 2 ];

		switch ( location ) {
			case OPERATION_CONSTANT.PATH.MAIN:
				this.selectedItem = OPERATION_CONSTANT.PATH.MAIN;
				break;
			case NEWS_CONSTANT.PATH.MAIN:
				this.selectedItem = NEWS_CONSTANT.PATH.MAIN;
				break;
			case CLIENT_CONSTANT.PATH.MAIN:
				this.selectedItem = CLIENT_CONSTANT.PATH.MAIN;
				break;
			case CONFIG_CONSTANT.PATH.MAIN:
				this.selectedItem = CONFIG_CONSTANT.PATH.MAIN;
				break;
		}
	}
}
