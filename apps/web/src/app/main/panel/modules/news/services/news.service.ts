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
	News
} from '../interfaces';

@Injectable()
export class NewsService {

	private readonly _endPoint: string
		= '/NewItems';
	private readonly _apiService: AccountApiService
		= inject( AccountApiService );

	/**
	 * @return {Observable}
	 */
	public getAll(): Observable<News[]> {
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
	public getDetail( id: ULID ): Observable<News> {
		return this._apiService
		.call( `${this._endPoint}/detail/${id}` );
	}

	/**
	 * @param {NewsCreate=} data
	 * @return {Observable}
	 */
	public create( data?: News ): Observable<ULID> {
		return this._apiService
		.call( `${this._endPoint}`, 'POST', data );
	}

	/**
	 * @param {ULID} id
	 * @param {NewsUpdate} data
	 * @return {Observable}
	 */
	public update( data: News ): Observable<void> {
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
