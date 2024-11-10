import {
	ChangeDetectionStrategy,
	Component
} from '@angular/core';
import _ from 'lodash';

import fontIcon from 'assets/fonts/icomoon/selection.json';

import {
	Unsubscriber
} from '@core';

@Unsubscriber()
@Component({
	selector		: 'guideline',
	templateUrl		: './guideline.pug',
	host			: { class: 'flex layout-column' },
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class GuidelineComponent {
	// Icon
	public icons: typeof fontIcon.icons = fontIcon.icons;

	constructor() {}

}
