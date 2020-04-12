
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { NgxGustavguezAuthService } from './ngx-gustavguez-auth.service';

@Injectable({
	providedIn: 'root',
})
export class NgxGustavguezAuthGuard implements CanActivate {

	constructor(
		private ngxGustavguezAuthService: NgxGustavguezAuthService) { }

	canActivate(): boolean {
		// Active user session?
		if (this.ngxGustavguezAuthService.isLogged()) {
			return true;
		}

		// Redirect login form
		this.ngxGustavguezAuthService.checkAndNotifyMeState();
		return false;
	}
}
