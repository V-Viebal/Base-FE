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
	CUBParagraphEditorComponent,
	CUBParagraphEditorData,
	CUBPopupComponent,
	CUBToastService
} from '@cub/material';

import {
	OperationService
} from '../services';
import {
	OperationDetail,
	OperationType
} from '../interfaces';

@Component({
	selector: 'operation',
	templateUrl: '../templates/operation.pug',
	styleUrls: ['../styles/operation.scss'],
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class OperationComponent implements OnInit, OnDestroy {

	@ViewChild( 'popup' )
	public popup: CUBPopupComponent;
	@ViewChild( CUBParagraphEditorComponent )
	protected readonly editor: CUBParagraphEditorComponent;

	protected readonly titleControl: FormControl
		= new FormControl( undefined );
	protected readonly typeControl: FormControl
		= new FormControl( undefined );
	protected readonly operationTypeControl: FormControl
		= new FormControl( undefined );

	protected isNew: boolean;
	protected operations: OperationDetail[];
	protected descriptionData: CUBParagraphEditorData;
	protected descriptionRaw: string;
	protected operationsSubsription?: Subscription;
	protected operation: OperationDetail;
	protected operationType: OperationType;
	protected operationTypes: any[]
		= [
			{
				value: OperationType.OVERSEA,
				label: 'Visa du học',
			},
			{
				value: OperationType.TOURISM,
				label: 'Visa du lịch',
			},
			{
				value: OperationType.EMPLOYMENT,
				label: 'Visa việc làm',
			},
			{
				value: OperationType.IMMIGRATION,
				label: 'Visa định cư',
			},
			{
				value: OperationType.SPONSORSHIP,
				label: 'Visa bảo lãnh',
			},
			{
				value: OperationType.VISIT,
				label: 'Visa thăm thân',
			},
		];

	private readonly _operationService: OperationService
		= inject( OperationService );
	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	private readonly _confirmService: CUBConfirmService
		= inject( CUBConfirmService );
	private readonly _toastService: CUBToastService
		= inject( CUBToastService );

	protected _operationsBk: OperationDetail[];

	ngOnInit(): void {
		this.operationsSubsription
			= this._operationService
			.getAll()
			.pipe(
				finalize( () => {
					this._cdRef.markForCheck();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: ( operations: any ) => {
					this.operations = _.cloneDeep( operations );
					this._operationsBk = _.cloneDeep( operations );
				},
			});
	}

	ngOnDestroy(): void {
		this.operationsSubsription && this.operationsSubsription.unsubscribe();
		this.operations = [];
	}

	/**
	 * @return {void}
	 */
	protected filterByType( types: OperationType[] ) {
		if ( _.isStrictEmpty( types ) ) {
			this.operations
				= _.cloneDeep( this._operationsBk );

			this._cdRef.detectChanges();
			return;
		}

		this.operations
			= _.filter(
				this._operationsBk,
				( operation: OperationDetail ) =>
					_.includes( types, operation.type )
			);

		this._cdRef.detectChanges();
	}

	/**
	 * @return {void}
	 */
	protected onDescriptionChange() {
		this.operation.description
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

				setTimeout(() => {
					this.descriptionData
						= undefined;
					this.operation
						= undefined;
				});
			},
		});

	}

	protected save() {
		this.operation.description
			= _.cloneDeep( this.editor.parse() );

		if ( this.isNew ) {
			this._operationService
			.create( this.operation )
			.pipe(
				finalize( () => {
					this._cdRef.detectChanges();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: ( id: ULID ) => {
					this.operation.id = id;
					this.operations.unshift( this.operation );
					this._operationsBk.unshift( this.operation );

					this.popup.close();

					this._toastService
					.success(
						'OPERATION.MESSAGE.SUCCESS'
					);

					setTimeout(() => {
						this.descriptionData = undefined;
						this.titleControl.reset();
						this.typeControl.reset();
						this.operation = undefined;
					});
				},
				error: () => {
					this._toastService
					.danger(
						'OPERATION.MESSAGE.FAIL'
					);
				},
			});
		} else {
			this._operationService
			.update( this.operation )
			.pipe(
				finalize( () => {
					this._cdRef.detectChanges();
				} ),
				untilCmpDestroyed( this )
			)
			.subscribe({
				next: () => {
					const index: number
						= _.findIndex(
							this.operations,
							( operation: OperationDetail ) =>
								operation.id === this.operation.id
						);
					this.operations[ index ] = _.cloneDeep( this.operation );

					const indexBk: number
						= _.findIndex(
							this.operations,
							( operation: OperationDetail ) =>
								operation.id === this.operation.id
						);
					this._operationsBk[ indexBk ] = _.cloneDeep( this.operation );

					this.popup.close();

					this._toastService
					.success(
						'OPERATION.MESSAGE.SUCCESS'
					);

					setTimeout(() => {
						this.descriptionData
							= undefined;
						this.titleControl.reset();
						this.typeControl.reset();
						this.operation = undefined;
					});
				},
				error: () => {
					this._toastService
					.danger(
						'OPERATION.MESSAGE.FAIL'
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

				this._operationService
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
							this.operations,
							( operation: OperationDetail ) =>
								operation.id === id
						);
						_.remove(
							this._operationsBk,
							( operation: OperationDetail ) =>
								operation.id === id
						);

						this._toastService
						.success(
							'OPERATION.MESSAGE.SUCCESS'
						);
					},
					error: () => {
						this._toastService
						.danger(
							'OPERATION.MESSAGE.FAIL'
						);
					},
				});
			},
		});
	}

	protected newOperation() {
		this.isNew
			= true;
		this.operation
			= {
				id: undefined,
				name: '',
				type: OperationType.OVERSEA,
				description: undefined,
			};

		this.descriptionData
			= undefined;
	}

	protected editOperation( operation: OperationDetail ) {
		this.isNew
			= false;
		this.descriptionData
			= operation?.description.data;
		this.operation
			= _.cloneDeep( operation );
	}

}
