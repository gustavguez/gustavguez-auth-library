import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { NgxGustavguezCoreModule } from 'ngx-gustavguez-core';

import { NgxGustavguezAuthInterceptor } from './ngx-gustavguez-auth.interceptor';
import { NgxGustavguezAuthLoginComponent } from './ngx-gustavguez-auth-login/ngx-gustavguez-auth-login.component';

@NgModule({
	declarations: [NgxGustavguezAuthLoginComponent],
	imports: [
		CommonModule,
		LocalStorageModule,
		ReactiveFormsModule,
		NgxGustavguezCoreModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: NgxGustavguezAuthInterceptor,
			multi: true
		}
	],
	exports: [NgxGustavguezAuthLoginComponent]
})
export class NgxGustavguezAuthModule { }
