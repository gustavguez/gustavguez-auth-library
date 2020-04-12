import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HttpClientModule } from '@angular/common/http';
import { NgxGustavguezCoreModule } from 'ngx-gustavguez-core';
import { NgxGustavguezAuthModule } from 'projects/ngx-gustavguez-auth/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		LocalStorageModule.forRoot({
			prefix: 'ngx-gustavguez-auth-module',
			storageType: 'localStorage'
		}),
		NgxGustavguezCoreModule,
		NgxGustavguezAuthModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
