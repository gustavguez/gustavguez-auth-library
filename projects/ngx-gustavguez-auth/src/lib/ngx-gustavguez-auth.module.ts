import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageModule } from 'angular-2-local-storage';
import { NgxGustavguezCoreModule } from 'ngx-gustavguez-core';

import { NgxGustavguezAuthInterceptor } from './ngx-gustavguez-auth.interceptor';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		LocalStorageModule,
		NgxGustavguezCoreModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: NgxGustavguezAuthInterceptor,
			multi: true
		}
	],
	exports: []
})
export class NgxGustavguezAuthModule { }
