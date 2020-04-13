import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'ngx-gustavguez-core';

import { environment } from 'src/environments/environment';
import { NgxGustavguezAuthService, NgxGustavguezConfigModel, NgxGustavguezMeModel } from 'projects/ngx-gustavguez-auth/src/public-api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	// Models
	me: NgxGustavguezMeModel;
	imageUrl: string;

	// Inject services
	constructor(
		private apiService: ApiService,
		private ngxGustavguezAuthService: NgxGustavguezAuthService
	){}

	// On component init
	ngOnInit(){
		// Load image url
		this.imageUrl = environment.api.URL_IMAGES;

		// Load url to all api service calls
		this.apiService.setApiURL(environment.api.URL);

		// Load auth config
		this.ngxGustavguezAuthService.setConfig(new NgxGustavguezConfigModel(
			environment.oauth.GRANT_TYPE,
			environment.oauth.GRANT_TYPE_REFRESH,
			environment.oauth.CLIENT_ID,
			environment.oauth.CLIENT_SECRET,
			environment.ls.ACCESS_TOKEN,
			environment.ls.LAST_AVATAR,
			environment.ls.LAST_USER,
			environment.api.OAUTH_URI,
			environment.api.OAUTH_URI,
			environment.api.ME_URI
		));

		// Watch state
		this.ngxGustavguezAuthService.getOnSessionStateChange().subscribe(() => {
			// Load me
			this.me = this.ngxGustavguezAuthService.getMe();
		});
		
		// Load previous session
		this.ngxGustavguezAuthService.loadSession().subscribe((result: boolean) => {
			console.log(result);
		});
	}

	// Custom events
	onLoginSuccess(): void {
		console.log('SUCCESS');
	}

	onLoginError(error: HttpErrorResponse): void {
		console.log(error);
	}

	onLogout() {
		this.ngxGustavguezAuthService.logout();
	}
}
