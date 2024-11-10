/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import Link from 'quill/formats/link';

export default class TruncateBlot extends Link {

	static blotName: string = 'truncate';
	static tagName: string = 'a';
	static className: string = 'ql-truncate';

	static create(): HTMLElement {
		return super.create( '#' );
	}

	attach() {
		super.attach();

		const rootNode: HTMLElement
			= this.scroll.domNode;
		const node: HTMLElement
			= this.domNode;

		node.addEventListener(
			'click',
			( event: MouseEvent ) => {
				event.stopPropagation();
				event.preventDefault();

				rootNode.dispatchEvent(
					new CustomEvent(
						`${TruncateBlot.blotName}-clicked`,
						{
							bubbles: true,
							detail: {
								blot: this,
								event,
							},
						}
					)
				);
			}
		);
	}

}
