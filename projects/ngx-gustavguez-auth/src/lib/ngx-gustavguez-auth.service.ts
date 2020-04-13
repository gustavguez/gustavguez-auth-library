import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ApiService, ApiResponseModel } from 'ngx-gustavguez-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgxGustavguezConfigModel } from './ngx-gustavguez-config.model';
import { NgxGustavguezAccessTokenModel } from './ngx-gustavguez-access-token.model';
import { NgxGustavguezLastMeModel } from './ngx-gustavguez-last-me.model';
import { NgxGustavguezMeModel } from './ngx-gustavguez-me.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class NgxGustavguezAuthService {

	// Models
	private me: NgxGustavguezMeModel;
	private config: NgxGustavguezConfigModel;
	private lastMe: NgxGustavguezLastMeModel;
	private accessToken: NgxGustavguezAccessTokenModel;

	// User session events emitters
	private onSessionStateChange: EventEmitter<boolean>;
	private onMeParsed: EventEmitter<any>;
	private onMeChanged: EventEmitter<NgxGustavguezMeModel>;

	// Service constructure
	constructor(
		private storageService: LocalStorageService,
		private apiService: ApiService) {
		// Create event emitters
		this.onSessionStateChange = new EventEmitter<boolean>();
		this.onMeChanged = new EventEmitter<NgxGustavguezMeModel>();
		this.onMeParsed = new EventEmitter<any>();

		// Default values
		this.config = new NgxGustavguezConfigModel();
	}

	// Methods
	public setConfig(config: NgxGustavguezConfigModel): void {
		this.config = config;
	}

	public getLastMe(): NgxGustavguezLastMeModel {
		return this.lastMe;
	}

	public getAccessToken(): NgxGustavguezAccessTokenModel {
		return this.accessToken;
	}

	public getMe(): NgxGustavguezMeModel {
		return this.me;
	}

	public isLogged(): boolean {
		return !!this.me;
	}

	public getOnSessionStateChange(): Observable<boolean> {
		return this.onSessionStateChange;
	}

	public getOnMeChanged(): Observable<NgxGustavguezMeModel> {
		return this.onMeChanged;
	}

	public getOnMeParsed(): Observable<any> {
		return this.onMeParsed;
	}

	// Generate a access token
	public login(loginUsername: string, loginPassword: string): Observable<boolean> {
		// Create an observable
		const obs = new Observable<boolean>((observer: any) => {
			// Set root strategy
			this.apiService.changeApiResponseStrategy('root');

			// Request token
			this.apiService.createObj(this.config.oauthUri, {
				username: loginUsername,
				password: loginPassword,
				grant_type: this.config.grantType,
				client_id: this.config.clientId,
				client_secret: this.config.clientSecret
			}).pipe(
				map((response: ApiResponseModel) => {
					// Save token to Local storage
					if (response.data) {
						this.storageService.set(this.config.accessTokenLsKey, response.data);
					}

					// Creates the access token model
					return this.parseAccessToken(response.data);
				})
			).subscribe((response: NgxGustavguezAccessTokenModel) => {
				// Load accesstoken
				this.accessToken = response;

				// Load to apiService to
				this.apiService.setAccessToken(this.accessToken.token);

				// Check meUrl
				if (this.config.oauthMeUri) {
					// Request me info
					this.requestMe().subscribe(
						() => {
							// Notify user state
							this.checkAndNotifyMeState();

							// Restore
							this.apiService.restoreApiResponseStrategy();

							// Load response
							observer.next(true);
							observer.complete();
						},
						() => {
							// Rise error
							observer.error(response);
						}
					);
				} else {
					// Restore
					this.apiService.restoreApiResponseStrategy();

					// Complete subscribe
					observer.next(true);
					observer.complete();
				}
			}, (response: HttpErrorResponse) => {
				// Rise error
				observer.error(response);
			});
		});
		return obs;
	}

	// Generate a access token
	public requestMe(): Observable<NgxGustavguezMeModel> {
		// Set root strategy
		this.apiService.changeApiResponseStrategy('data');

		// Do request
		return this.apiService.fetchData(this.config.oauthMeUri).pipe(
			map((response: ApiResponseModel) => {
				// Load userLogged
				this.me = new NgxGustavguezMeModel();
				this.me.fromJSON(response.data.me);

				// Emit parsed and changed
				this.onMeParsed.emit(response.data);
				this.onMeChanged.emit(this.me);

				// Load user logged
				this.lastMe = new NgxGustavguezLastMeModel();
				this.lastMe.avatar = this.me.profileImage;
				this.lastMe.username = this.me.username;

				// Save to LS
				this.storageService.set(this.config.lastMeAvatarLsKey, this.me.profileImage);
				this.storageService.set(this.config.lastMeUsernameLsKey, this.me.username);

				// Restore
				this.apiService.restoreApiResponseStrategy();
				return this.me;
			})
		);
	}

	public refreshToken(): Observable<NgxGustavguezAccessTokenModel> {
		// Get refresh token
		const refreshToken: string = this.accessToken instanceof NgxGustavguezAccessTokenModel ? this.accessToken.refreshToken : '';

		// Set root strategy
		this.apiService.changeApiResponseStrategy('root');

		// Request token
		return this.apiService.createObj(this.config.oauthUri, {
			refresh_token: refreshToken,
			grant_type: this.config.grantTypeRefresh,
			client_id: this.config.clientId
		}).pipe(
			map((response: ApiResponseModel) => {
				// Check response
				if (response.data) {
					// Load the refresh token
					response.data.refresh_token = refreshToken;

					// Save to LS
					this.storageService.set(this.config.accessTokenLsKey, response.data);
				}

				// Creates the access token model
				this.accessToken = this.parseAccessToken(response.data);

				// Load to apiService to
				this.apiService.setAccessToken(this.accessToken.token);

				// Restore
				this.apiService.restoreApiResponseStrategy();
				return this.accessToken;
			})
		);
	}

	public loadSession(): Observable<boolean> {
		// Create an observable
		const obs = new Observable<boolean>((observer: any) => {
			const accessTokenLs: any = this.storageService.get(this.config.accessTokenLsKey);
			const lastMeAvatar: string = this.storageService.get(this.config.lastMeAvatarLsKey);
			const lastMeUsername: string = this.storageService.get(this.config.lastMeUsernameLsKey);
			const completeObservable: Function = (result: boolean) => {
				observer.next(result);
				observer.complete();
			};

			// Load last user
			if (lastMeUsername || lastMeUsername) {
				this.lastMe = new NgxGustavguezLastMeModel(
					lastMeUsername,
					lastMeAvatar
				);
			} else {
				this.lastMe = null;
			}

			// Check access token getted from ls
			if (accessTokenLs) {
				// Creat access token
				this.accessToken = this.parseAccessToken(accessTokenLs);

				// Check token
				if (this.accessToken instanceof NgxGustavguezAccessTokenModel) {
					// Has configured me
					if (this.config.oauthMeUri) {
						// Load to apiService to
						this.apiService.setAccessToken(this.accessToken.token);

						// Request me info
						this.requestMe().subscribe(
							() => {
								// Notify user state
								this.checkAndNotifyMeState();

								// Finish load
								completeObservable(true);
							},
							() => {
								// Finish load
								completeObservable(false);
							}
						);
					} else {
						// Load success without me
						completeObservable(true);
					}
				} else {
					// Finish load
					completeObservable(false);
				}
			} else {
				// Finish load
				completeObservable(false);
			}
		});
		return obs;
	}

	public logout(): void {
		// Clear Local storage
		this.storageService.remove(this.config.accessTokenLsKey);

		// Clear data in memory
		this.me = null;
		this.accessToken = null;

		// Emit state change
		this.checkAndNotifyMeState();
	}

	public checkAndNotifyMeState(): void {
		if (this.me instanceof NgxGustavguezMeModel && this.accessToken instanceof NgxGustavguezAccessTokenModel) {
			// Emit login event
			this.onSessionStateChange.emit(true);
		} else {
			// Emit login event
			this.onSessionStateChange.emit(false);
		}
	}

	public updateMe(me: NgxGustavguezMeModel): void {
		this.me = me;

		// Emit change
		this.onMeChanged.emit(me);
	}

	// Private methods
	private parseAccessToken(json: any): NgxGustavguezAccessTokenModel {
		let accessToken: NgxGustavguezAccessTokenModel = null;

		// Check access token
		if (json && json.access_token) {
			// parse expiration date
			const expiration: Date = new Date();
			const expiresIn: number = json.expires_in / 60;
			expiration.setMinutes(expiration.getMinutes() + expiresIn);

			// Creates the access token model
			accessToken = new NgxGustavguezAccessTokenModel(
				json.access_token,
				json.refresh_token,
				expiration
			);
		}
		return accessToken;
	}
}
