/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Optional,
	Output,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import _ from 'lodash';

/* Editor */
import EditorJS, {
	API,
	BlockMutationEvent,
	EditorConfig,
	OutputData
} from '@editorjs/editorjs';
/* Tools */
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import Checklist from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import RawTool from '@editorjs/raw';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import edjsParser from 'editorjs-parser';
import ColorPlugin from 'editorjs-text-color-plugin';
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';
import Embed from '@editorjs/embed';
import Alert from 'editorjs-alert';

import {
	CoerceBoolean,
	untilCmpDestroyed
} from 'angular-core';
import {
	CUB_FILE_SERVICE,
	CUBFileService,
	CUBUploadFileResponse
} from '@cub/material/file-picker';

export type CUBParagraphEditorData = OutputData;
export type CUBParagraphEditorParseOutput = {
	html: string;
	text: string;
	data: CUBParagraphEditorData;
};

const parser: edjsParser = new edjsParser();

@Component({
	selector: 'cub-paragraph-editor',
	template: '<div #editorJS></div>',
	styleUrls: [ './editor.scss' ],
	host: { class: 'cub-paragraph-editor' },
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CUBParagraphEditorComponent
implements OnChanges, OnDestroy, AfterViewInit {

	@Input() public data: CUBParagraphEditorData;
	@Input() public raw: string;
	@Input() public placeholder: string;
	@Input() @CoerceBoolean()
	public autoFocusOn: boolean;
	@Input() @CoerceBoolean()
	public readonly: boolean;
	@Input() public config: EditorConfig;

	@Output() public dataChange: EventEmitter<OutputData>
		= new EventEmitter<OutputData>();

	public editor: EditorJS;

	@ViewChild( 'editorJS' )
	protected readonly editorJS:
		ElementRef<HTMLDivElement>;

	constructor(
		@Optional() @Inject( CUB_FILE_SERVICE )
		protected readonly fileService: CUBFileService
	) {}

	ngOnChanges( changes: SimpleChanges ) {
		if ( !changes.data
			&& !changes.raw ) {
			return;
		}

		this._render();
	}

	ngOnDestroy() {
		this.editor.destroy();
	}

	ngAfterViewInit() {
		const defaultConfig: EditorConfig
			= {
				logLevel: 'ERROR' as any,
				tools: {
					alignmentTuneTool: {
						class: AlignmentTuneTool,
					},
					checklist: {
						class: Checklist,
						shortcut: 'CMD+SHIFT+C',
					},
					code: {
						class: Code,
						shortcut: 'CMD+SHIFT+E',
					},
					delimiter: {
						class: Delimiter,
						shortcut: 'CMD+SHIFT+D',
					},
					color: {
						class: ColorPlugin,
						config: {
							colorCollections: [
								'#EC7878',
								'#9C27B0',
								'#673AB7',
								'#3F51B5',
								'#0070FF',
								'#03A9F4',
								'#00BCD4',
								'#4CAF50',
								'#8BC34A',
								'#CDDC39',
								'#FFF',
							],
							defaultColor: '#FF1300',
							type: 'text',
							customPicker: true,
						},
						shortcut: 'CMD+SHIFT+O',
					},
					marker: {
						class: ColorPlugin,
						config: {
							defaultColor: '#FFBF00',
							type: 'marker',
							icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
						},
						shortcut: 'CMD+SHIFT+M',
					},
					header: {
						class: Header,
						inlineToolbar: ['bold', 'italic', 'underline', 'link', 'marker', 'color'],
						shortcut: 'CMD+SHIFT+H',
						config: {
							levels: [1, 2, 3, 4, 5, 6],
							defaultLevel: 1,
						},
						tunes: [ 'alignmentTuneTool' ],
					},
					inlineCode: {
						class: InlineCode,
						shortcut: 'CMD+SHIFT+M',
					},
					alert: {
						class: Alert,
						inlineToolbar: true,
						shortcut: 'CMD+SHIFT+A',
						tunes: [ 'alignmentTuneTool' ],
					},
					list: {
						class: List as any,
						config: {
							defaultStyle: 'unordered',
						},
						inlineToolbar: ['bold', 'italic', 'underline', 'link', 'marker', 'color'],
					},
					paragraph: {
						class: Paragraph,
						inlineToolbar: ['bold', 'italic', 'underline', 'link', 'marker', 'color'],
						tunes: [ 'alignmentTuneTool' ],
						shortcut: 'CMD+SHIFT+T',
					},
					quote: {
						class: Quote,
						shortcut: 'CMD+SHIFT+Q',
					},
					rawTool: {
						class: RawTool,
						shortcut: 'CMD+SHIFT+R',
					},
					table: {
						class: Table as any,
						shortcut: 'CMD+SHIFT+B',
					},
					underline: {
						class: Underline,
					},
					embed: {
						class: Embed,
						config: {
							services: {
								youtube: true,
								vimeo: true,
								twitter: true,
								instagram: true,
								facebook: true,
								googlemaps: true,
								tiktok: true,
								spotify: true,
							},
						},
						shortcut: 'CMD+SHIFT+E',
					},
					linkTool: {
						class: LinkTool,
						config: {
							endpoint: 'ENVIRONMENT.FILE_SYSTEM_API_URL',
						},
						shortcut: 'CMD+SHIFT+L',
					},
					image: {
						class: ImageTool,
						config: {
							uploader: {
								uploadByFile: (file: any) => {
									return new Promise(( resolve: any, reject: any ) => {
										this.fileService
										.upload(
											{ files: [file] },
											undefined,
											{
												reportProgress: true,
												observe: 'events',
											}
										)
										.pipe(untilCmpDestroyed(this))
										.subscribe({
											next: ({ type, body }: CUBUploadFileResponse ) => {
												if ( type === 4 ) { // Uploaded
													for (
														const uploadedFile
														of
														body
													) {
														resolve({
															success: 1,
															file: {
																url: uploadedFile.url,
															},
														});
													}
												}
											},
											error: () => {
												reject({
													success: 0,
													message: 'File upload failed',
												});
											},
										});
									});
								},

								uploadByUrl(url: string) {
									return {
										success: 1,
										file: {
											url: url,
										},
									};
								},
							},
						},
						shortcut: 'CMD+SHIFT+I',
					},
				},
			};

		const onReadyFn: () => void
			= this.config?.onReady;
		const onChangeFn: (
			api: API,
			event: BlockMutationEvent
				| BlockMutationEvent[]
		) => void = this.config?.onChange;

		this.editor = new EditorJS({
			..._.defaultsDeep(
				defaultConfig,
				this.config
			),

			holder: this.editorJS.nativeElement,
			placeholder: this.placeholder,
			autofocus: this.autoFocusOn,
			readOnly: this.readonly,
			onReady: () => {
				new DragDrop( this.editor );
				new Undo({ editor: this.editor });

				onReadyFn?.();
			},
			onChange: (
				api: API,
				event: BlockMutationEvent
					| BlockMutationEvent[]
			) => {
				if ( this.readonly ) return;

				api.saver
				.save()
				.then((
					outputData: OutputData
				) => {
					this.dataChange.emit(
						this.data = outputData
					);
				})
				.catch( console.error );

				onChangeFn?.( api, event );
			},
		});

		this._render();
	}

	/**
	 * @return {Promise}
	 */
	public save(): Promise<CUBParagraphEditorData> {
		return this.editor.save();
	}

	/**
	 * @param {CUBParagraphEditorData=} data
	 * @return {CUBParagraphEditorParseOutput | null}
	 */
	public parse(
		data: CUBParagraphEditorData = this.data
	): CUBParagraphEditorParseOutput | null {
		if ( !data?.blocks?.length ) {
			return null;
		}

		const div: HTMLDivElement
			= document.createElement( 'div' );
		const html: string
			= parser.parse( data );

		div.innerHTML = html;

		const text: string = div.innerText;

		return { html, text, data };
	}

	/**
	 * @return {void}
	 */
	private _render() {
		this
		.editor
		?.isReady
		.then(() => {
			if ( this.data ) {
				this
				.editor
				.blocks
				.render( this.data );
			} else if ( this.raw ) {
				this
				.editor
				.blocks
				.renderFromHTML( this.raw );
			}
		})
		.catch( console.error );
	}

}
