import {
	Component,
	ChangeDetectionStrategy,
	OnInit,
	ViewChild,
	ViewContainerRef,
	inject,
	ChangeDetectorRef,
	AfterViewInit
} from '@angular/core';
import {
	filter
} from 'rxjs';
import {
	Event,
	NavigationEnd,
	Router
} from '@angular/router';

import {
	ScrollEvent,
	Unsubscriber,
	untilCmpDestroyed
} from '@core';

import {
	CUBScrollBarComponent,
	CUBToastService,
	CUBToastType
} from '@cub/material';

import {
	NavigationBarComponent
} from '@main/common/navigation-bar/components';
import {
	FooterComponent
} from '@main/common/footer/components';

import {
	BaseService
} from '../services';

@Unsubscriber()
@Component({
	selector		: 'base',
	templateUrl		: '../templates/base.pug',
	styleUrls		: [ '../styles/base.scss' ],
	host			: { class: 'base' },
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit, AfterViewInit {

	@ViewChild( NavigationBarComponent )
	public header: NavigationBarComponent;
	@ViewChild( FooterComponent )
	public footer: FooterComponent;
	@ViewChild( 'container' )
	public container: ViewContainerRef;
	@ViewChild( 'scrollBar' )
	public scrollBar: CUBScrollBarComponent;

	protected lastScrollY: number;
	protected showScrollTop: boolean;

	private readonly _baseService: BaseService
		= inject( BaseService );
	private readonly _toastService: CUBToastService
		= inject( CUBToastService );
	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	private readonly _router: Router
		= inject( Router );

	ngOnInit() {
		this._initData();
		this._initSubscription();
	}

	ngAfterViewInit(): void {

		this._router.events
		.pipe(
			// Filter only NavigationEnd events
			filter( ( event: Event ) => event instanceof NavigationEnd ),
			untilCmpDestroyed( this )
		)
		.subscribe( () => {
			if ( this.header?.isMobileMenuVisible ) {
				this.header.toggleMobileMenu();
			}

			setTimeout(() => {
				this.scrollToTop();
			}, 200);
		});

		const observer: IntersectionObserver
			= new IntersectionObserver(
				( entries: IntersectionObserverEntry[] ) => {
					entries.forEach(( entry: IntersectionObserverEntry ) => {
						const rect: DOMRectReadOnly
							= entry.boundingClientRect;

						if ( entry.target === this.header.elementRef.nativeElement ) {
							if (
								!entry.isIntersecting
								&& rect.top < 90
							) {
								this.showScrollTop = true;
								this.header.isSticky = true;
							} else if ( entry.isIntersecting ) {
								this.showScrollTop = false;
								this.header.isSticky = false;
							}
						}

						if ( entry.target === this.footer.elementRef.nativeElement ) {
							console.log(rect);

							this._baseService.footer$.next( entry );
						}

						this._cdRef.markForCheck();
						this.header.markForCheck();
					});
				}
			);

		observer.observe( this.header.elementRef.nativeElement );
		observer.observe( this.footer.elementRef.nativeElement );

		this.scrollBar.scrolling$
		.pipe( untilCmpDestroyed( this ) )
		.subscribe({
			next: ( event: ScrollEvent ) => {
				this._baseService.scrollEvent$.next( event as any );
			}
		})
	}

	protected scrollToTop(): void {
		this.scrollBar.nativeElement.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	protected scrollToBottom(): void {
		this.scrollBar.nativeElement.scrollTo({
			top: this.scrollBar.nativeElement.scrollHeight,
			behavior: 'smooth'
		});
	}

	private _initSubscription() {
		this._baseService.toast$
		.pipe( untilCmpDestroyed( this ) )
		.subscribe({
			next: ( value: any ) => {
				switch( value.type ) {
					case CUBToastType.Success:
						this._toastService
						.success(
							value.message
						);
						break;
					case CUBToastType.Danger:
						this._toastService
						.danger(
							value.message
						);
						break;
					case CUBToastType.Default:

						break;
					case CUBToastType.Info:
						break;
					case CUBToastType.Warning:
						break;
				}
			},
		});
	}

	/**
	 * @return {void}
	 */
	private _initData() {
	}

}
