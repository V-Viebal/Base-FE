import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class CustomTranslateLoader {
	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	getTranslation(lang: string): Observable<any> {
		if (isPlatformServer(this.platformId)) {
			// Server-side: Use fs and path
			const fs = require('fs');
			const path = require('path');
			const filePath = path.resolve(__dirname, `./i18n/${lang}.json`);
			const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			return of(translations);
		} else {
			// Client-side: Load translations differently (e.g., via HttpClient or static assets)
			const translations = require(`./i18n/${lang}.json`);
			return of(translations);
		}
	}
}
