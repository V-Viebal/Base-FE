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
	NewsService
} from '../services';
import {
	News
} from '../interfaces';

@Component({
	selector: 'news',
	templateUrl: '../templates/news.pug',
	styleUrls: ['../styles/news.scss'],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {

	@ViewChild( 'popup' )
	public popup: CUBPopupComponent;
	@ViewChild( CUBParagraphEditorComponent )
	protected readonly editor: CUBParagraphEditorComponent;

	protected readonly titleControl: FormControl
		= new FormControl( undefined );
	protected readonly descriptionControl: FormControl
		= new FormControl( undefined );

	protected isNew: boolean;
	protected files: CUBFile[];
	protected newss: News[];
	protected descriptionData: CUBParagraphEditorData;
	protected descriptionRaw: string;
	protected newssSubsription?: Subscription;
	protected news: News;

	private readonly _newsService: NewsService
		= inject( NewsService );
	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	private readonly _confirmService: CUBConfirmService
		= inject( CUBConfirmService );
	private readonly _toastService: CUBToastService
		= inject( CUBToastService );

	ngOnInit(): void {
		this.newssSubsription
			= this._newsService
			.getAll()
			.pipe(
				finalize( () => {
					this._cdRef.markForCheck();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: ( newss: any ) => {
					this.newss = newss;
				},
			});
	}

	ngOnDestroy(): void {
		this.newssSubsription && this.newssSubsription.unsubscribe();
		this.newss = [];
	}

	/**
	 * @return {void}
	 */
	protected onDescriptionChange() {
		this.news.content
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

				this.descriptionData
					= undefined;
				this.news
					= undefined;
			},
		});

	}

	protected save() {
		this.news.content
			= _.cloneDeep( this.editor.parse() );
		this.news.thumbnailId
			= this.files?.[ 0 ].id;

		if ( this.isNew ) {
			this._newsService
			.create( this.news )
			.pipe(
				finalize( () => {
					this._cdRef.detectChanges();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: ( id: ULID ) => {
					this.news.id = id;
					this.news.thumbnail
						= this.files?.[ 0 ];
					this.newss.unshift( this.news );
					this.newss
						= _.cloneDeep( this.newss );

					this.popup.close();

					this._toastService
					.success(
						'NEWS.MESSAGE.SUCCESS'
					);

					this.descriptionData = undefined;
					this.titleControl.reset();
					this.descriptionControl.reset();
					this.news = undefined;
				},
				error: () => {
					this._toastService
					.danger(
						'NEWS.MESSAGE.FAIL'
					);
				},
			});
		} else {
			this._newsService
			.update( this.news )
			.pipe(
				finalize( () => {
					this._cdRef.detectChanges();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: () => {
					this.news.thumbnail
						= this.files?.[ 0 ];
					const index: number
						= _.findIndex(
							this.newss,
							( news: News ) =>
								news && news.id === this.news.id
						);

					this.newss[ index ] = _.cloneDeep( this.news );

					this.popup.close();

					this._toastService
					.success(
						'NEWS.MESSAGE.SUCCESS'
					);

					this.descriptionData
						= undefined;

					this.titleControl.reset();
					this.descriptionControl.reset();
					this.news = undefined;
				},
				error: () => {
					this._toastService
					.danger(
						'NEWS.MESSAGE.FAIL'
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

				this._newsService
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
							this.newss,
							( news: News ) =>
								news.id === id
						);

						this._toastService
						.success(
							'NEWS.MESSAGE.SUCCESS'
						);
					},
					error: () => {
						this._toastService
						.danger(
							'NEWS.MESSAGE.FAIL'
						);
					},
				});
			},
		});
	}

	protected newNews() {
		this.isNew
			= true;
		this.news
			= {
				id: undefined,
				topic: '',
				description: '',
				content: undefined,
				thumbnail: undefined,
			};

		this.files
			= undefined;
		this.descriptionData
			= undefined;
	}

	protected editNews( news: News ) {
		this.isNew
			= false;
		this.descriptionData
			= news?.content.data;
		this.news
			= _.cloneDeep( news );
		this.files
			= news?.thumbnail
				? [ news.thumbnail ]
				: undefined;

		this._cdRef.markForCheck();
	}

}
