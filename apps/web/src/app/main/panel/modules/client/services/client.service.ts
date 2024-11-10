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

import {
	AccountApiService
} from '@main/account/services';

import {
	Client
} from '../interfaces';

@Injectable()
export class ClientService {

	private readonly _endPoint: string
		= '/ContactItems';
	private readonly _apiService: AccountApiService
		= inject( AccountApiService );

	/**
	 * @return {Observable}
	 */
	public getAll(): Observable<Client[]> {
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
	public getDetail( id: ULID ): Observable<Client> {
		return this._apiService
		.call( `${this._endPoint}/detail/${id}` );
	}

	/**
	 * @param {ClientCreate=} data
	 * @return {Observable}
	 */
	public create(
		data?: Client
	): Observable<ULID> {
		return this._apiService
		.call( `${this._endPoint}`, 'POST', data );
	}

	/**
	 * @param {ClientUpdate} data
	 * @return {Observable}
	 */
	public update(
		data: Client
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
