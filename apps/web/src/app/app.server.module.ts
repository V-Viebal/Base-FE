import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from '@main/auth/interceptors';

@NgModule({
	imports: [
		AppModule, // Import shared client-side logic
		ServerModule, // Enable SSR functionality
	],
	providers: [
		provideHttpClient(withFetch()), // Optimize HTTP requests for server
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true, // Retain authentication logic
		},
	],
	bootstrap: [AppComponent], // Bootstrap the root component
})
export class AppServerModule {}
