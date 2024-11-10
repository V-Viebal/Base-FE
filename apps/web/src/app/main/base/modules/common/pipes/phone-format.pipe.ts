import {
	Pipe,
	PipeTransform
} from '@angular/core';
import {
	SafeHtml
} from '@angular/platform-browser';
import {
	Memoize
} from 'angular-core';

@Pipe({
	name: 'phoneFormat',
	standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {

	/**
	 * @param {string} value
	 * @return {SafeHtml}
	 */
	@Memoize()
	public transform( value: string ): SafeHtml {
		return value?.replace( /(\d{4})(\d{3})(\d{3})/, '$1 $2 $3' );
	}

}
