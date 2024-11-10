import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	OnInit,
	inject
} from '@angular/core';
import {
	Unsubscriber,
	untilCmpDestroyed
} from '@core';

import {
	CUBDialogRef,
	CUB_DIALOG_CONTEXT,
	CUB_DIALOG_REF
} from '@cub/material/dialog';

import {
	Account
} from '@main/account/interfaces';
import {
	AccountService
} from '@main/account/services';

export type DialogItemHamburgerContext = {};

@Unsubscriber()
@Component({
	selector: 'dialog-hamburger',
	templateUrl: './dialog-hamburger.pug',
	styleUrls: [ './dialog-hamburger.scss' ],
	host: { class: 'dialog-hamburger' },
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogHamburgerComponent
implements OnInit {

	protected account: Account;

	private readonly _accountService: AccountService
		= inject( AccountService );
	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );

	constructor(
		@Inject( CUB_DIALOG_CONTEXT )
		protected dialogContext: DialogItemHamburgerContext,
		@Inject( CUB_DIALOG_REF )
		private _dialogRef: CUBDialogRef
	) {}

	ngOnInit() {
		if ( !this.dialogContext ) return;

		this._initSubscription();
	}

	/**
	 * @return {void}
	 */
	protected openSignUpDialog() {
	}

	/**
	 * @return {void}
	 */
	protected openSignInDialog() {
		this._accountService.storedAccount
			= {
				name: 'Minh Đặng',
				email: 'dangminh200320@gmail.com'
			};

		this._cdRef.markForCheck();
	}

	/**
	 * @return {void}
	 */
	protected openAccountPage() {
	}

	/**
	 * @return {void}
	 */
	protected openSettingPage() {
	}

	/**
	 * @return {void}
	 */
	protected openExplorePage() {
	}

	/**
	 * @return {void}
	 */
	protected openAboutUsPage() {
	}

	/**
	 * @return {void}
	 */
	protected openFAQPage() {
	}

	/**
	 * @return {void}
	 */
	protected logout() {
		this._accountService
		.clearStoredAccount();
	}

	/**
	 * @return {void}
	 */
	protected close() {
		this._dialogRef.close();
	}

	/**
	 * @return {void}
	 */
	private _initSubscription() {
		this._accountService.storedAccountChange$
		.pipe( untilCmpDestroyed( this ) )
		.subscribe( ( account: Account ) => {
			this.account = account;

			this._cdRef.markForCheck();
		} );
	}

}
