import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {
	CoreModule,
	FormModule
} from '@core';

import { CUBPreloadModule } from '@cub/cub.preload.module';
import { CUBIconModule } from '@cub/material/icon';

import { routing } from './guideline.routing';
import { GuidelineComponent } from './guideline.component';

@NgModule({
	imports: [
		DragDropModule,

		CoreModule,
		FormModule,

		CUBPreloadModule,
		CUBIconModule,

		routing,
	],
	exports: [],
	declarations: [
		GuidelineComponent,
	],
	providers: [
	],
})
export class GuidelineModule {}
