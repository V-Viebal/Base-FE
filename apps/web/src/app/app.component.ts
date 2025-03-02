import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	inject
} from '@angular/core';
import {
	LocaleService,
	Unsubscriber
} from 'angular-core';

@Unsubscriber()
@Component({
	selector		: 'app',
	templateUrl		: './app.pug',
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	private readonly _localeService: LocaleService
		= inject( LocaleService );

	ngOnInit(): void {
		this._localeService.useLocale( 'vi' ).subscribe( () => {
			this._cdRef.markForCheck();
		} );
	}
}
