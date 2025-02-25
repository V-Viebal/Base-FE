import {
	Component,
	ChangeDetectionStrategy,
} from '@angular/core';

import {
	Unsubscriber
} from '@core';

@Unsubscriber()
@Component({
	selector		: 'home',
	templateUrl		: '../templates/home.pug',
	host			: { class: 'home' },
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
}
