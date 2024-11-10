import {
	PipeTransform,
	Pipe
} from '@angular/core';
import {
	OperationType
} from '../interfaces';

@Pipe({ name: 'typeTranslate' })
export class TypeTranslatePipe
implements PipeTransform {

	public static TYPE_CONSTANT: {
		[ key in OperationType ]: string
	} = {
			[ OperationType.EMPLOYMENT ]: 'Visa việc làm',
			[ OperationType.IMMIGRATION ]: 'Visa định cư',
			[ OperationType.OVERSEA ]: 'Visa du học',
			[ OperationType.SPONSORSHIP ]: 'Visa bảo lãnh',
			[ OperationType.TOURISM ]: 'Visa du lịch',
			[ OperationType.VISIT ]: 'Visa thăm thân',
		};

	/**
	 * @param {IAccessPermission=} access
	 * @return {string}
	 */
	public transform(
		access: OperationType = OperationType.OVERSEA
	): string {
		return TypeTranslatePipe.TYPE_CONSTANT[ access ];
	}

}
