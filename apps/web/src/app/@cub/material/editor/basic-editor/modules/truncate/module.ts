import Quill, { Delta } from 'quill/core';
import Module from 'quill/core/module';
import {
	EmitterSource
} from 'quill/core/emitter';
import _ from 'lodash';

import TruncateBlot from './blot';

export type TruncateProps = {
	limit: number;
	labels: [ string, string ];
	onTruncateExpanded(
		module: TruncateModule,
		blot: TruncateBlot
	);
	onTruncateCollapsed(
		module: TruncateModule,
		blot: TruncateBlot
	);
};

export default class TruncateModule
	extends Module<TruncateProps> {

	/* eslint-disable @typescript-eslint/explicit-member-accessibility */
	static moduleName: string = 'truncate';
	static DEFAULTS: Partial<TruncateProps> = {
		limit: 150,
		labels: [ 'Show more', 'Show less' ],
	};

	private _currDelta: Delta;
	private _isExpanded: boolean;

	constructor(
		quill: Quill,
		options: Partial<TruncateProps>
	) {
		super( quill, options );

		quill.on(
			'text-change',
			(
				d: Delta,
				_od: Delta,
				_s: EmitterSource
			) => {
				if ( !options.limit
					|| quill.getLength() <= options.limit ) {
					return;
				}

				this._currDelta = d;

				this._collaspe();
			}
		);

		const rootNode: HTMLElement
			= quill.scroll.domNode;

		rootNode.addEventListener(
			`${TruncateBlot.blotName}-clicked`,
			( e: CustomEvent ) => {
				if ( this._isExpanded ) {
					this._collaspe();

					this.options.onTruncateCollapsed?.(
						this,
						e.detail.blot
					);
				} else {
					this._expand();

					this.options.onTruncateExpanded?.(
						this,
						e.detail.blot
					);
				}

				this._isExpanded = !this._isExpanded;
			}
		);
	}

	private _expand() {
		this.quill.setContents(
			new Delta([ ...this._currDelta.ops ])
			.insert(
				this.options.labels[ 1 ],
				{ truncate: true }
			),
			Quill.sources.SILENT
		);
	}

	private _collaspe() {
		this.quill.updateContents(
			new Delta()
			.retain( this.options.limit )
			.delete( this.quill.getLength() )
			.insert( '...' )
			.insert(
				this.options.labels[ 0 ],
				{ truncate: true }
			),
			Quill.sources.SILENT
		);
	}

}
