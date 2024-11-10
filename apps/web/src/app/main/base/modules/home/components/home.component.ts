import {
	Component,
	ChangeDetectorRef,
	ChangeDetectionStrategy,
	OnInit,
	inject,
	AfterViewInit
} from '@angular/core';
import {
	FormBuilder,
	FormGroup
} from '@angular/forms';
import { finalize } from 'rxjs';
import Swiper from 'swiper';
import {
	Navigation,
	Pagination,
	Autoplay
} from 'swiper/modules';

import {
	Unsubscriber,
	untilCmpDestroyed
} from '@core';

import Swal from 'sweetalert2';

import {
	BaseService
} from '@main/base/services';
import {
	Email
} from '@main/base/interfaces';

Swiper.use([ Navigation, Pagination, Autoplay ]);

@Unsubscriber()
@Component({
	selector		: 'home',
	templateUrl		: '../templates/home.pug',
	host			: { class: 'home' },
	changeDetection	: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit {

	protected readonly IS_MOBILE: boolean
		= /Mobile/i.test( navigator.userAgent );
	protected email: Email;
	protected clients: Client[];
	protected emailForm: FormGroup;

	private readonly _cdRef: ChangeDetectorRef
		= inject( ChangeDetectorRef );
	private readonly _baseService: BaseService
		= inject( BaseService );
	private readonly _fb: FormBuilder
		= inject( FormBuilder );

	constructor() {
		this.emailForm
			= this._fb.group({
				fullName: undefined,
				email: undefined,
				phone: undefined,
				description: undefined,
			});
	}

	ngOnInit() {
		this._initData();
	}

	ngAfterViewInit(): void {
		new Swiper('.swiper.banner-carousel', {
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: '.swiper-button-next-unique',
				prevEl: '.swiper-button-prev-unique'
			}
		});

		if ( this.IS_MOBILE ) {
			new Swiper('.swiper.gallery-carousel', {
				slidesPerView: 2,
				loop: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			});
			new Swiper('.swiper.client', {
				slidesPerView: 2,
				loop: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			});
			new Swiper('.swiper.countries-carousel', {
				slidesPerView: 2,
				loop: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			});
		} else {
			new Swiper('.swiper.gallery-carousel', {
				slidesPerView: 4,
				loop: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			});
			new Swiper('.swiper.client', {
				slidesPerView: 4,
				loop: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			});
			new Swiper('.swiper.countries-carousel', {
				slidesPerView: 6,
				loop: true,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
			});
		}
	}

	/**
	 * @return {void}
	 */
	protected sendEmail() {
		this.email
			= {
				title: this.emailForm.controls.fullName.value,
				fullName: this.emailForm.controls.fullName.value,
				description: this.emailForm.controls.description.value,
				phone: this.emailForm.controls.phone.value,
				email: this.emailForm.controls.email.value,
			};

		Swal.fire({
			title: 'Gửi thành công!',
			text: 'Chúng tôi sẽ nhanh chóng liên hệ với bạn.',
			icon: 'success',
			confirmButtonText: 'Cảm ơn bạn',
			backdrop: false,
			timer: 2500,
		});
		this.emailForm.markAsPristine();

		this._baseService.sendEmail( this.email )
		.pipe(
			finalize( () => {
				this._cdRef.markForCheck();
			} ),
			untilCmpDestroyed( this )
		)
		.subscribe({
			error: () => {
				Swal.fire({
					title: 'Gửi thất bại!',
					text: 'Làm phiền bạn kiểm tra internet và gửi lại sau.',
					icon: 'error',
					confirmButtonText: 'Cảm ơn bạn',
					backdrop: false,
					timer: 2500,
				});
			},
		});
	}

	/**
	 * @return {void}
	 */
	private _initData() {
	}

}
