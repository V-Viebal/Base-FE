import {
	Injectable,
	inject
} from '@angular/core';
import {
	Observable
} from 'rxjs';

import {
	AccountApiService
} from '@main/account/services';

import {
	Config
} from '../interfaces';

@Injectable()
export class ConfigService {

	private readonly _endPoint: string
		= '/AVConfigurations';
	private readonly _apiService: AccountApiService
		= inject( AccountApiService );

	/**
	 * @param {ULID} id
	 * @return {Observable}
	 */
	public get(): Observable<Config> {
		return this._apiService
		.call( `${this._endPoint}` );
	}

	/**
	 * @param {ULID} id
	 * @param {ConfigUpdate} data
	 * @return {Observable}
	 */
	public update( data: Config ): Observable<void> {
		return this._apiService
		.call( `${this._endPoint}`, 'PUT', data );
	}

}
