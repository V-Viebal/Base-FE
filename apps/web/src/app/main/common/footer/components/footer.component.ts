import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	OnInit
} from '@angular/core';

import {
	Unsubscriber
} from '@core';

@Unsubscriber()
@Component({
	selector		: 'footer-bar',
	templateUrl		: '../templates/footer.pug',
	styleUrls		: [ '../styles/footer.scss' ],
	host			: { class: 'footer' },
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent
implements OnInit {

	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	public readonly elementRef: ElementRef
		= inject( ElementRef );

	ngOnInit() {}

	public markForCheck() {
		this._cdRef.markForCheck();
	}
}
