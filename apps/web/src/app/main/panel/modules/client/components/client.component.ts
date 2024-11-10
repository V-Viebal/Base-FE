import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	OnDestroy,
	inject,
	ViewChild
} from '@angular/core';
import {
	FormControl
} from '@angular/forms';
import {
	untilCmpDestroyed
} from 'angular-core';
import {
	Subscription,
	finalize
} from 'rxjs';
import _ from 'lodash';
import { ULID } from 'ulidx';

import {
	CUBConfirmService,
	CUBFile,
	CUBParagraphEditorComponent,
	CUBParagraphEditorData,
	CUBPopupComponent,
	CUBToastService
} from '@cub/material';

import {
	ClientService
} from '../services';
import {
	Client
} from '../interfaces';

@Component({
	selector: 'client',
	templateUrl: '../templates/client.pug',
	styleUrls: ['../styles/client.scss'],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class ClientComponent implements OnInit, OnDestroy {

	@ViewChild( 'popup' )
	public popup: CUBPopupComponent;
	@ViewChild( CUBParagraphEditorComponent )
	protected readonly editor: CUBParagraphEditorComponent;

	protected readonly titleControl: FormControl
		= new FormControl( undefined );
	protected readonly storyControl: FormControl
		= new FormControl( undefined );

	protected isNew: boolean;
	protected files: CUBFile[];
	protected clients: Client[];
	protected contentData: CUBParagraphEditorData;
	protected contentRaw: string;
	protected clientsSubsription?: Subscription;
	protected client: Client;

	private readonly _clientService: ClientService
		= inject( ClientService );
	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	private readonly _confirmService: CUBConfirmService
		= inject( CUBConfirmService );
	private readonly _toastService: CUBToastService
		= inject( CUBToastService );

	ngOnInit(): void {
		this.clientsSubsription
			= this._clientService
			.getAll()
			.pipe(
				finalize( () => {
					this._cdRef.markForCheck();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: ( clients: any ) => {
					this.clients = clients;
				},
			});
	}

	ngOnDestroy(): void {
		this.clientsSubsription && this.clientsSubsription.unsubscribe();
		this.clients = [];
	}

	/**
	 * @return {void}
	 */
	protected onDescriptionChange() {
		this.client.content
			= this.editor.parse();
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

				this.popup.close();

				this.contentData
					= undefined;
				this.client
					= undefined;
			},
		});

	}

	protected save() {
		this.client.content
			= _.cloneDeep( this.editor.parse() );
		this.client.thumbnailId
			= this.files?.[ 0 ].id;

		if ( this.isNew ) {
			this._clientService
			.create( this.client )
			.pipe(
				finalize( () => {
					this._cdRef.detectChanges();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: ( id: ULID ) => {
					this.client.thumbnail
						= this.files?.[ 0 ];
					this.client.id = id;
					this.clients.unshift( this.client );
					this.clients
						= _.cloneDeep( this.clients );

					this.popup.close();

					this._toastService
					.success(
						'CLIENT.MESSAGE.SUCCESS'
					);

					this.contentData = undefined;
					this.titleControl.reset();
					this.storyControl.reset();
					this.client = undefined;
				},
				error: () => {
					this._toastService
					.danger(
						'CLIENT.MESSAGE.FAIL'
					);
				},
			});
		} else {
			this._clientService
			.update( this.client )
			.pipe(
				finalize( () => {
					this._cdRef.detectChanges();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: () => {
					this.client.thumbnail
						= this.files?.[ 0 ];
					const index: number
						= _.findIndex(
							this.clients,
							( client: Client ) =>
								client.id === this.client.id
						);
					this.clients[ index ] = _.cloneDeep( this.client );

					this.popup.close();

					this._toastService
					.success(
						'CLIENT.MESSAGE.SUCCESS'
					);

					this.contentData
						= undefined;

					this.titleControl.reset();
					this.storyControl.reset();
					this.client = undefined;
				},
				error: () => {
					this._toastService
					.danger(
						'CLIENT.MESSAGE.FAIL'
					);
				},
			});
		}
	}

	protected delete( id: ULID ) {
		this._confirmService
		.open(
			'Bạn có chắc chắn muốn xoá?',
			'',
			{
				warning			: true,
				buttonDiscard	: 'Giữ lại',
				buttonApply: {
					text: 'Xoá',
					type: 'destructive',
				},
				translate: false,
			}
		)
		.afterClosed()
		.subscribe({
			next: ( answer: boolean ) => {
				if ( !answer ) return;

				this._clientService
				.delete( id )
				.pipe(
					finalize( () => {
						this._cdRef.markForCheck();
					} ),
					untilCmpDestroyed( this )
				)
				.subscribe({
					next: () => {
						_.remove(
							this.clients,
							( client: Client ) =>
								client.id === id
						);

						this._toastService
						.success(
							'CLIENT.MESSAGE.SUCCESS'
						);
					},
					error: () => {
						this._toastService
						.danger(
							'CLIENT.MESSAGE.FAIL'
						);
					},
				});
			},
		});
	}

	protected newClient() {
		this.isNew
			= true;
		this.client
			= {
				id: undefined,
				name: '',
				story: '',
				content: undefined,
				thumbnail: undefined,
			};

		this.files
			= undefined;
		this.contentData
			= undefined;
	}

	protected editClient( client: Client ) {
		this.isNew
			= false;
		this.contentData
			= client?.content.data;
		this.client
			= _.cloneDeep( client );
		this.files
			= client?.thumbnail
				? [ client.thumbnail as CUBFile ]
				: undefined;
	}

}
