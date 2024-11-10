import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation,
	inject
} from '@angular/core';
import {
	TranslateService
} from '@ngx-translate/core';
import Quill, {
	Delta,
	EmitterSource,
	Op,
	QuillOptions
} from 'quill/core';
import _ from 'lodash';

import './modules/register';
import TagModule from './modules/tag/module';
import TruncateModule from './modules/truncate/module';
import {
	CUBBasicEditorContent
} from './editor.component';

export function convertContentToDelta(
	quill: Quill,
	content: CUBBasicEditorContent
): Delta | Op[] {
	let delta: Delta | Op[];

	if ( content ) {
		delta = content.delta
			|| quill.clipboard.convert( content );
	}

	return delta;
}

@Component({
	selector: 'cub-basic-editor-content-viewer',
	template: '<div #editorJS></div>',
	styleUrls: [ './content-viewer.scss' ],
	host: { class: 'cub-basic-editor-content-viewer' },
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CUBBasicEditorContentViewerComponent
implements AfterViewInit, OnChanges {

	@Input() public limit: number;
	@Input() public content: CUBBasicEditorContent;
	@Input() public options: Omit<QuillOptions, 'readOnly'>;

	@ViewChild( 'editorJS' )
	protected readonly editorJS:
		ElementRef<HTMLDivElement>;

	private readonly _translateService: TranslateService
		= inject( TranslateService );

	private _quill: Quill;

	ngOnChanges( changes: SimpleChanges ) {
		if ( this._quill ) {
			if ( changes.content ) {
				this.setContent( this.content );
			}
		}
	}

	ngAfterViewInit() {
		this._quill = new Quill(
			this.editorJS.nativeElement,
			_.defaultsDeep(
				this.options,
				{
					modules: {
						[ TagModule.moduleName ]: true,
						[ TruncateModule.moduleName ]: {
							limit: this.limit,
							labels: [
								this._translateService.instant(
									'CUB.LABEL.SHOW_MORE'
								),
								this._translateService.instant(
									'CUB.LABEL.SHOW_LESS'
								),
							],
						},
					},
				}
			)
		);

		// Always disable the editor
		this._quill.disable();

		// Init content
		this.setContent( this.content );
	}

	/**
	 * Sets content of the quill editor
	 * @param content
	 * @param source
	 */
	public setContent(
		content: CUBBasicEditorContent,
		source?: EmitterSource
	) {
		this._quill.setContents(
			convertContentToDelta(
				this._quill,
				content
			),
			source
		);
	}

}
