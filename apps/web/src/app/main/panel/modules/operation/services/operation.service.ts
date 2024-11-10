import {
	Injectable,
	inject
} from '@angular/core';
import {
	Observable,
	of,
	switchMap
} from 'rxjs';
import {
	ULID
} from 'ulidx';

import _ from 'lodash';

import {
	AccountApiService
} from '@main/account/services';

import {
	Operation,
	OperationDetail,
	OperationDetailCreate
} from '../interfaces';

@Injectable()
export class OperationService {

	private readonly _endPoint: string
		= '/ServiceItems';
	private readonly _apiService: AccountApiService
		= inject( AccountApiService );

	/**
	 * @return {Observable}
	 */
	public getAll(): Observable<Operation[]> {
		return this._apiService
		.call( `${this._endPoint}`, 'GET', {PageNumber: 1, PageSize: 100} )
		.pipe(
			switchMap( ( result: any ) => {
				return of( result.items );
			})
		);
	}

	/**
	 * @param {ULID} id
	 * @return {Observable}
	 */
	public getDetail( id: ULID ): Observable<OperationDetail> {
		return this._apiService
		.call( `${this._endPoint}/detail/${id}` );
	}

	/**
	 * @param {OperationCreate=} data
	 * @return {Observable}
	 */
	public create(
		data?: OperationDetailCreate
	): Observable<ULID> {
		return this._apiService
		.call( `${this._endPoint}`, 'POST', data );
	}

	/**
	 * @param {OperationUpdate} data
	 * @return {Observable}
	 */
	public update(
		data: OperationDetail
	): Observable<void> {
		return this._apiService
		.call( `${this._endPoint}/${data.id}`, 'PUT', data );
	}

	/**
	 * @param {ULID} id
	 * @return {Observable}
	 */
	public delete( id: ULID ): Observable<void> {
		return this._apiService
		.call( `${this._endPoint}/${id}`, 'DELETE' );
	}
}
