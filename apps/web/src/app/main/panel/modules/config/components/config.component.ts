import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	inject,
	ViewChild
} from '@angular/core';
import {
	FormBuilder,
	FormGroup
} from '@angular/forms';
import {
	untilCmpDestroyed
} from 'angular-core';
import {
	Subscription,
	finalize
} from 'rxjs';

import {
	CUBConfirmService,
	CUBParagraphEditorComponent,
	CUBParagraphEditorData,
	CUBPopupComponent,
	CUBToastService
} from '@cub/material';

import {
	ConfigService
} from '../services';
import {
	Config,
	LANGUAGES
} from '../interfaces';

@Component({
	selector: 'config',
	templateUrl: '../templates/config.pug',
	styleUrls: ['../styles/config.scss'],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent implements OnInit {

	@ViewChild( 'popup' )
	public popup: CUBPopupComponent;
	@ViewChild( CUBParagraphEditorComponent )
	protected readonly editor: CUBParagraphEditorComponent;

	protected readonly LANGUAGES: typeof LANGUAGES = LANGUAGES;

	protected configForm: FormGroup;

	protected loaded: boolean;
	protected config: Config;
	protected descriptionData: CUBParagraphEditorData;
	protected descriptionRaw: string;
	protected configsSubsription?: Subscription;

	private readonly _fb: FormBuilder
		= inject( FormBuilder );
	private readonly _configService: ConfigService
		= inject( ConfigService );
	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	private readonly _confirmService: CUBConfirmService
		= inject( CUBConfirmService );
	private readonly _toastService: CUBToastService
		= inject( CUBToastService );

	constructor() {
		this.configForm
			= this._fb.group({
				phone: undefined,
				email: undefined,
				socialLink: undefined,
				zaloLink: undefined,
				addressLink: undefined,
				addressMap: undefined,
				address: undefined,
				language: undefined,
			});
	}

	ngOnInit(): void {
		this._configService.get()
		.pipe(
			finalize( () => {
				this.loaded = true;
				this._cdRef.markForCheck();
			} ),
			untilCmpDestroyed( this )
		)
		.subscribe({
			next: ( config: Config ) => {
				this.config = config;

				if ( this.config?.language ) return;

				this.config
					= {
						...this.config,
						language: LANGUAGES.VN,
					};
			},
		});
	}

	protected openBlank() {
		window.open(
			'https://media.star-telegram.com/static/labs/GoogleMapLink2/index.html',
			'_blank'
		);
	}

	protected close() {
		this._confirmService
		.open(
			'Bạn có chắc chắn muốn hủy?',
			'Bạn sẽ mất tiến trình hiện tại',
			{
				warning			: true,
				buttonDiscard	: 'Giữ lại',
				buttonApply: {
					text: 'Xác nhận hủy',
					type: 'destructive',
				},
				translate: false,
			}
		)
		.afterClosed()
		.subscribe({
			next: ( answer: boolean ) => {
				if ( !answer ) return;

				this.config
					= undefined;

				this.popup.close();
			},
		});

	}

	protected save() {
		this.config
			= {
				...this.config,
				phone: this.configForm.controls.phone.value,
				addressLink: this.configForm.controls.addressLink.value,
				addressMap: this.configForm.controls.addressMap.value,
				address: this.configForm.controls.address.value,
				email: this.configForm.controls.email.value,
				socialLink: this.configForm.controls.socialLink.value,
				zaloLink: this.configForm.controls.zaloLink.value,
			};

		this._configService
		.update( this.config )
		.pipe(
			finalize( () => {
				this._cdRef.detectChanges();
			} ),
			untilCmpDestroyed( this )
		)
		.subscribe({
			next: () => {
				this.configForm.markAsPristine();

				this._toastService
				.success(
					'CONFIG.MESSAGE.SUCCESS'
				);
			},
			error: () => {
				this._toastService
				.danger(
					'CONFIG.MESSAGE.FAIL'
				);
			},
		});
	}

}
