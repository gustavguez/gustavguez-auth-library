import { __decorate } from "tslib";
import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ApiService, ApiResponseModel } from 'ngx-gustavguez-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxGustavguezConfigModel } from './ngx-gustavguez-config.model';
import { NgxGustavguezAccessTokenModel } from './ngx-gustavguez-access-token.model';
import { NgxGustavguezLastMeModel } from './ngx-gustavguez-last-me.model';
import { NgxGustavguezMeModel } from './ngx-gustavguez-me.model';
import * as i0 from "@angular/core";
import * as i1 from "angular-2-local-storage";
import * as i2 from "ngx-gustavguez-core";
let NgxGustavguezAuthService = class NgxGustavguezAuthService {
    // Service constructure
    constructor(storageService, apiService) {
        this.storageService = storageService;
        this.apiService = apiService;
        // Create event emitters
        this.onSessionStateChange = new EventEmitter();
        this.onMeChanged = new EventEmitter();
        this.onMeParsed = new EventEmitter();
        // Default values
        this.config = new NgxGustavguezConfigModel();
    }
    // Methods
    setConfig(config) {
        this.config = config;
    }
    getLastMe() {
        return this.lastMe;
    }
    getAccessToken() {
        return this.accessToken;
    }
    getMe() {
        return this.me;
    }
    isLogged() {
        return !!this.me;
    }
    getOnSessionStateChange() {
        return this.onSessionStateChange;
    }
    getOnMeChanged() {
        return this.onMeChanged;
    }
    getOnMeParsed() {
        return this.onMeParsed;
    }
    // Generate a access token
    login(loginUsername, loginPassword) {
        // Create an observable
        const obs = new Observable((observer) => {
            // Set root strategy
            this.apiService.changeApiResponseStrategy('root');
            // Request token
            this.apiService.createObj(this.config.oauthUri, {
                username: loginUsername,
                password: loginPassword,
                grant_type: this.config.grantType,
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret
            }).pipe(map((response) => {
                // Save token to Local storage
                if (response.data) {
                    this.storageService.set(this.config.accessTokenLsKey, response.data);
                }
                // Creates the access token model
                return this.parseAccessToken(response.data);
            })).subscribe((response) => {
                // Load accesstoken
                this.accessToken = response;
                // Load to apiService to
                this.apiService.setAccessToken(this.accessToken.token);
                // Check meUrl
                if (this.config.oauthMeUri) {
                    // Request me info
                    this.requestMe().subscribe(() => {
                        // Notify user state
                        this.checkAndNotifyMeState();
                        // Restore
                        this.apiService.restoreApiResponseStrategy();
                        // Load response
                        observer.next(true);
                        observer.complete();
                    }, () => {
                        // Rise error
                        observer.error(response);
                    });
                }
                else {
                    // Restore
                    this.apiService.restoreApiResponseStrategy();
                    // Complete subscribe
                    observer.next(true);
                    observer.complete();
                }
            }, (response) => {
                // Rise error
                observer.error(response);
            });
        });
        return obs;
    }
    // Generate a access token
    requestMe() {
        // Set root strategy
        this.apiService.changeApiResponseStrategy('data');
        // Do request
        return this.apiService.fetchData(this.config.oauthMeUri).pipe(map((response) => {
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
        }));
    }
    refreshToken() {
        // Get refresh token
        const refreshToken = this.accessToken instanceof NgxGustavguezAccessTokenModel ? this.accessToken.refreshToken : '';
        // Set root strategy
        this.apiService.changeApiResponseStrategy('root');
        // Request token
        return this.apiService.createObj(this.config.oauthUri, {
            refresh_token: refreshToken,
            grant_type: this.config.grantTypeRefresh,
            client_id: this.config.clientId
        }).pipe(map((response) => {
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
        }));
    }
    loadSession() {
        // Create an observable
        const obs = new Observable((observer) => {
            const accessTokenLs = this.storageService.get(this.config.accessTokenLsKey);
            const lastMeAvatar = this.storageService.get(this.config.lastMeAvatarLsKey);
            const lastMeUsername = this.storageService.get(this.config.lastMeUsernameLsKey);
            const completeObservable = (result) => {
                observer.next(result);
                observer.complete();
            };
            // Load last user
            if (lastMeUsername || lastMeUsername) {
                this.lastMe = new NgxGustavguezLastMeModel(lastMeUsername, lastMeAvatar);
            }
            else {
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
                        this.requestMe().subscribe(() => {
                            // Notify user state
                            this.checkAndNotifyMeState();
                            // Finish load
                            completeObservable(true);
                        }, () => {
                            // Finish load
                            completeObservable(false);
                        });
                    }
                    else {
                        // Load success without me
                        completeObservable(true);
                    }
                }
                else {
                    // Finish load
                    completeObservable(false);
                }
            }
            else {
                // Finish load
                completeObservable(false);
            }
        });
        return obs;
    }
    logout() {
        // Clear Local storage
        this.storageService.remove(this.config.accessTokenLsKey);
        // Clear data in memory
        this.me = null;
        this.accessToken = null;
        // Emit state change
        this.checkAndNotifyMeState();
    }
    checkAndNotifyMeState() {
        if (this.me instanceof NgxGustavguezMeModel && this.accessToken instanceof NgxGustavguezAccessTokenModel) {
            // Emit login event
            this.onSessionStateChange.emit(true);
        }
        else {
            // Emit login event
            this.onSessionStateChange.emit(false);
        }
    }
    updateMe(me) {
        this.me = me;
        // Emit change
        this.onMeChanged.emit(me);
    }
    // Private methods
    parseAccessToken(json) {
        let accessToken = null;
        // Check access token
        if (json && json.access_token) {
            // parse expiration date
            const expiration = new Date();
            const expiresIn = json.expires_in / 60;
            expiration.setMinutes(expiration.getMinutes() + expiresIn);
            // Creates the access token model
            accessToken = new NgxGustavguezAccessTokenModel(json.access_token, json.refresh_token, expiration);
        }
        return accessToken;
    }
};
NgxGustavguezAuthService.ctorParameters = () => [
    { type: LocalStorageService },
    { type: ApiService }
];
NgxGustavguezAuthService.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgxGustavguezAuthService_Factory() { return new NgxGustavguezAuthService(i0.ɵɵinject(i1.LocalStorageService), i0.ɵɵinject(i2.ApiService)); }, token: NgxGustavguezAuthService, providedIn: "root" });
NgxGustavguezAuthService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], NgxGustavguezAuthService);
export { NgxGustavguezAuthService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1c3Rhdmd1ZXotYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQU1qRSxJQUFhLHdCQUF3QixHQUFyQyxNQUFhLHdCQUF3QjtJQWFwQyx1QkFBdUI7SUFDdkIsWUFDUyxjQUFtQyxFQUNuQyxVQUFzQjtRQUR0QixtQkFBYyxHQUFkLGNBQWMsQ0FBcUI7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUM5Qix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFMUMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxN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LElBQUksRUFBRSxDQUFDO1lBQ3BDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBQy9DLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBRTNELGlDQUFpQztZQUNqQyxXQUFXLEdBQUcsSUFBSSw2QkFBNkIsQ0FDOUMsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsVUFBVSxDQUNWLENBQUM7U0FDRjtRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3BCLENBQUM7Q0FDRCxDQUFBOztZQW5TeUIsbUJBQW1CO1lBQ3ZCLFVBQVU7OztBQWhCbkIsd0JBQXdCO0lBSHBDLFVBQVUsQ0FBQztRQUNYLFVBQVUsRUFBRSxNQUFNO0tBQ2xCLENBQUM7R0FDVyx3QkFBd0IsQ0FrVHBDO1NBbFRZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlU2VydmljZSB9IGZyb20gJ2FuZ3VsYXItMi1sb2NhbC1zdG9yYWdlJztcbmltcG9ydCB7IEFwaVNlcnZpY2UsIEFwaVJlc3BvbnNlTW9kZWwgfSBmcm9tICduZ3gtZ3VzdGF2Z3Vlei1jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1jb25maWcubW9kZWwnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWFjY2Vzcy10b2tlbi5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWxhc3QtbWUubW9kZWwnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3Vlek1lTW9kZWwgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LW1lLm1vZGVsJztcbmltcG9ydCB7IEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5ASW5qZWN0YWJsZSh7XG5cdHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgTmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlIHtcblxuXHQvLyBNb2RlbHNcblx0cHJpdmF0ZSBtZTogTmd4R3VzdGF2Z3Vlek1lTW9kZWw7XG5cdHByaXZhdGUgY29uZmlnOiBOZ3hHdXN0YXZndWV6Q29uZmlnTW9kZWw7XG5cdHByaXZhdGUgbGFzdE1lOiBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWw7XG5cdHByaXZhdGUgYWNjZXNzVG9rZW46IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsO1xuXG5cdC8vIFVzZXIgc2Vzc2lvbiBldmVudHMgZW1pdHRlcnNcblx0cHJpdmF0ZSBvblNlc3Npb25TdGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+O1xuXHRwcml2YXRlIG9uTWVQYXJzZWQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xuXHRwcml2YXRlIG9uTWVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8Tmd4R3VzdGF2Z3Vlek1lTW9kZWw+O1xuXG5cdC8vIFNlcnZpY2UgY29uc3RydWN0dXJlXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgc3RvcmFnZVNlcnZpY2U6IExvY2FsU3RvcmFnZVNlcnZpY2UsXG5cdFx0cHJpdmF0ZSBhcGlTZXJ2aWNlOiBBcGlTZXJ2aWNlKSB7XG5cdFx0Ly8gQ3JlYXRlIGV2ZW50IGVtaXR0ZXJzXG5cdFx0dGhpcy5vblNlc3Npb25TdGF0ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblx0XHR0aGlzLm9uTWVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxOZ3hHdXN0YXZndWV6TWVNb2RlbD4oKTtcblx0XHR0aGlzLm9uTWVQYXJzZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuXHRcdC8vIERlZmF1bHQgdmFsdWVzXG5cdFx0dGhpcy5jb25maWcgPSBuZXcgTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsKCk7XG5cdH1cblxuXHQvLyBNZXRob2RzXG5cdHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBOZ3hHdXN0YXZndWV6Q29uZmlnTW9kZWwpOiB2b2lkIHtcblx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0fVxuXG5cdHB1YmxpYyBnZXRMYXN0TWUoKTogTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsIHtcblx0XHRyZXR1cm4gdGhpcy5sYXN0TWU7XG5cdH1cblxuXHRwdWJsaWMgZ2V0QWNjZXNzVG9rZW4oKTogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwge1xuXHRcdHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuO1xuXHR9XG5cblx0cHVibGljIGdldE1lKCk6IE5neEd1c3Rhdmd1ZXpNZU1vZGVsIHtcblx0XHRyZXR1cm4gdGhpcy5tZTtcblx0fVxuXG5cdHB1YmxpYyBpc0xvZ2dlZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gISF0aGlzLm1lO1xuXHR9XG5cblx0cHVibGljIGdldE9uU2Vzc2lvblN0YXRlQ2hhbmdlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXHRcdHJldHVybiB0aGlzLm9uU2Vzc2lvblN0YXRlQ2hhbmdlO1xuXHR9XG5cblx0cHVibGljIGdldE9uTWVDaGFuZ2VkKCk6IE9ic2VydmFibGU8Tmd4R3VzdGF2Z3Vlek1lTW9kZWw+IHtcblx0XHRyZXR1cm4gdGhpcy5vbk1lQ2hhbmdlZDtcblx0fVxuXG5cdHB1YmxpYyBnZXRPbk1lUGFyc2VkKCk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0cmV0dXJuIHRoaXMub25NZVBhcnNlZDtcblx0fVxuXG5cdC8vIEdlbmVyYXRlIGEgYWNjZXNzIHRva2VuXG5cdHB1YmxpYyBsb2dpbihsb2dpblVzZXJuYW1lOiBzdHJpbmcsIGxvZ2luUGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXHRcdC8vIENyZWF0ZSBhbiBvYnNlcnZhYmxlXG5cdFx0Y29uc3Qgb2JzID0gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4oKG9ic2VydmVyOiBhbnkpID0+IHtcblx0XHRcdC8vIFNldCByb290IHN0cmF0ZWd5XG5cdFx0XHR0aGlzLmFwaVNlcnZpY2UuY2hhbmdlQXBpUmVzcG9uc2VTdHJhdGVneSgncm9vdCcpO1xuXG5cdFx0XHQvLyBSZXF1ZXN0IHRva2VuXG5cdFx0XHR0aGlzLmFwaVNlcnZpY2UuY3JlYXRlT2JqKHRoaXMuY29uZmlnLm9hdXRoVXJpLCB7XG5cdFx0XHRcdHVzZXJuYW1lOiBsb2dpblVzZXJuYW1lLFxuXHRcdFx0XHRwYXNzd29yZDogbG9naW5QYXNzd29yZCxcblx0XHRcdFx0Z3JhbnRfdHlwZTogdGhpcy5jb25maWcuZ3JhbnRUeXBlLFxuXHRcdFx0XHRjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmNsaWVudElkLFxuXHRcdFx0XHRjbGllbnRfc2VjcmV0OiB0aGlzLmNvbmZpZy5jbGllbnRTZWNyZXRcblx0XHRcdH0pLnBpcGUoXG5cdFx0XHRcdG1hcCgocmVzcG9uc2U6IEFwaVJlc3BvbnNlTW9kZWwpID0+IHtcblx0XHRcdFx0XHQvLyBTYXZlIHRva2VuIHRvIExvY2FsIHN0b3JhZ2Vcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zZXQodGhpcy5jb25maWcuYWNjZXNzVG9rZW5Mc0tleSwgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gQ3JlYXRlcyB0aGUgYWNjZXNzIHRva2VuIG1vZGVsXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMucGFyc2VBY2Nlc3NUb2tlbihyZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0fSlcblx0XHRcdCkuc3Vic2NyaWJlKChyZXNwb25zZTogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwpID0+IHtcblx0XHRcdFx0Ly8gTG9hZCBhY2Nlc3N0b2tlblxuXHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gcmVzcG9uc2U7XG5cblx0XHRcdFx0Ly8gTG9hZCB0byBhcGlTZXJ2aWNlIHRvXG5cdFx0XHRcdHRoaXMuYXBpU2VydmljZS5zZXRBY2Nlc3NUb2tlbih0aGlzLmFjY2Vzc1Rva2VuLnRva2VuKTtcblxuXHRcdFx0XHQvLyBDaGVjayBtZVVybFxuXHRcdFx0XHRpZiAodGhpcy5jb25maWcub2F1dGhNZVVyaSkge1xuXHRcdFx0XHRcdC8vIFJlcXVlc3QgbWUgaW5mb1xuXHRcdFx0XHRcdHRoaXMucmVxdWVzdE1lKCkuc3Vic2NyaWJlKFxuXHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHQvLyBOb3RpZnkgdXNlciBzdGF0ZVxuXHRcdFx0XHRcdFx0XHR0aGlzLmNoZWNrQW5kTm90aWZ5TWVTdGF0ZSgpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJlc3RvcmVcblx0XHRcdFx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnJlc3RvcmVBcGlSZXNwb25zZVN0cmF0ZWd5KCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gTG9hZCByZXNwb25zZVxuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5uZXh0KHRydWUpO1xuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5jb21wbGV0ZSgpO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0Ly8gUmlzZSBlcnJvclxuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5lcnJvcihyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBSZXN0b3JlXG5cdFx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnJlc3RvcmVBcGlSZXNwb25zZVN0cmF0ZWd5KCk7XG5cblx0XHRcdFx0XHQvLyBDb21wbGV0ZSBzdWJzY3JpYmVcblx0XHRcdFx0XHRvYnNlcnZlci5uZXh0KHRydWUpO1xuXHRcdFx0XHRcdG9ic2VydmVyLmNvbXBsZXRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIChyZXNwb25zZTogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcblx0XHRcdFx0Ly8gUmlzZSBlcnJvclxuXHRcdFx0XHRvYnNlcnZlci5lcnJvcihyZXNwb25zZSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gb2JzO1xuXHR9XG5cblx0Ly8gR2VuZXJhdGUgYSBhY2Nlc3MgdG9rZW5cblx0cHVibGljIHJlcXVlc3RNZSgpOiBPYnNlcnZhYmxlPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPiB7XG5cdFx0Ly8gU2V0IHJvb3Qgc3RyYXRlZ3lcblx0XHR0aGlzLmFwaVNlcnZpY2UuY2hhbmdlQXBpUmVzcG9uc2VTdHJhdGVneSgnZGF0YScpO1xuXG5cdFx0Ly8gRG8gcmVxdWVzdFxuXHRcdHJldHVybiB0aGlzLmFwaVNlcnZpY2UuZmV0Y2hEYXRhKHRoaXMuY29uZmlnLm9hdXRoTWVVcmkpLnBpcGUoXG5cdFx0XHRtYXAoKHJlc3BvbnNlOiBBcGlSZXNwb25zZU1vZGVsKSA9PiB7XG5cdFx0XHRcdC8vIExvYWQgdXNlckxvZ2dlZFxuXHRcdFx0XHR0aGlzLm1lID0gbmV3IE5neEd1c3Rhdmd1ZXpNZU1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubWUuZnJvbUpTT04ocmVzcG9uc2UuZGF0YS5tZSk7XG5cblx0XHRcdFx0Ly8gRW1pdCBwYXJzZWQgYW5kIGNoYW5nZWRcblx0XHRcdFx0dGhpcy5vbk1lUGFyc2VkLmVtaXQocmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdHRoaXMub25NZUNoYW5nZWQuZW1pdCh0aGlzLm1lKTtcblxuXHRcdFx0XHQvLyBMb2FkIHVzZXIgbG9nZ2VkXG5cdFx0XHRcdHRoaXMubGFzdE1lID0gbmV3IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLmxhc3RNZS5hdmF0YXIgPSB0aGlzLm1lLnByb2ZpbGVJbWFnZTtcblx0XHRcdFx0dGhpcy5sYXN0TWUudXNlcm5hbWUgPSB0aGlzLm1lLnVzZXJuYW1lO1xuXG5cdFx0XHRcdC8vIFNhdmUgdG8gTFNcblx0XHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zZXQodGhpcy5jb25maWcubGFzdE1lQXZhdGFyTHNLZXksIHRoaXMubWUucHJvZmlsZUltYWdlKTtcblx0XHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zZXQodGhpcy5jb25maWcubGFzdE1lVXNlcm5hbWVMc0tleSwgdGhpcy5tZS51c2VybmFtZSk7XG5cblx0XHRcdFx0Ly8gUmVzdG9yZVxuXHRcdFx0XHR0aGlzLmFwaVNlcnZpY2UucmVzdG9yZUFwaVJlc3BvbnNlU3RyYXRlZ3koKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMubWU7XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgcmVmcmVzaFRva2VuKCk6IE9ic2VydmFibGU8Tmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWw+IHtcblx0XHQvLyBHZXQgcmVmcmVzaCB0b2tlblxuXHRcdGNvbnN0IHJlZnJlc2hUb2tlbjogc3RyaW5nID0gdGhpcy5hY2Nlc3NUb2tlbiBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsID8gdGhpcy5hY2Nlc3NUb2tlbi5yZWZyZXNoVG9rZW4gOiAnJztcblxuXHRcdC8vIFNldCByb290IHN0cmF0ZWd5XG5cdFx0dGhpcy5hcGlTZXJ2aWNlLmNoYW5nZUFwaVJlc3BvbnNlU3RyYXRlZ3koJ3Jvb3QnKTtcblxuXHRcdC8vIFJlcXVlc3QgdG9rZW5cblx0XHRyZXR1cm4gdGhpcy5hcGlTZXJ2aWNlLmNyZWF0ZU9iaih0aGlzLmNvbmZpZy5vYXV0aFVyaSwge1xuXHRcdFx0cmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuXHRcdFx0Z3JhbnRfdHlwZTogdGhpcy5jb25maWcuZ3JhbnRUeXBlUmVmcmVzaCxcblx0XHRcdGNsaWVudF9pZDogdGhpcy5jb25maWcuY2xpZW50SWRcblx0XHR9KS5waXBlKFxuXHRcdFx0bWFwKChyZXNwb25zZTogQXBpUmVzcG9uc2VNb2RlbCkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayByZXNwb25zZVxuXHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YSkge1xuXHRcdFx0XHRcdC8vIExvYWQgdGhlIHJlZnJlc2ggdG9rZW5cblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLnJlZnJlc2hfdG9rZW4gPSByZWZyZXNoVG9rZW47XG5cblx0XHRcdFx0XHQvLyBTYXZlIHRvIExTXG5cdFx0XHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zZXQodGhpcy5jb25maWcuYWNjZXNzVG9rZW5Mc0tleSwgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDcmVhdGVzIHRoZSBhY2Nlc3MgdG9rZW4gbW9kZWxcblx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMucGFyc2VBY2Nlc3NUb2tlbihyZXNwb25zZS5kYXRhKTtcblxuXHRcdFx0XHQvLyBMb2FkIHRvIGFwaVNlcnZpY2UgdG9cblx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnNldEFjY2Vzc1Rva2VuKHRoaXMuYWNjZXNzVG9rZW4udG9rZW4pO1xuXG5cdFx0XHRcdC8vIFJlc3RvcmVcblx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnJlc3RvcmVBcGlSZXNwb25zZVN0cmF0ZWd5KCk7XG5cdFx0XHRcdHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIGxvYWRTZXNzaW9uKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXHRcdC8vIENyZWF0ZSBhbiBvYnNlcnZhYmxlXG5cdFx0Y29uc3Qgb2JzID0gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4oKG9ic2VydmVyOiBhbnkpID0+IHtcblx0XHRcdGNvbnN0IGFjY2Vzc1Rva2VuTHM6IGFueSA9IHRoaXMuc3RvcmFnZVNlcnZpY2UuZ2V0KHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuTHNLZXkpO1xuXHRcdFx0Y29uc3QgbGFzdE1lQXZhdGFyOiBzdHJpbmcgPSB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmdldCh0aGlzLmNvbmZpZy5sYXN0TWVBdmF0YXJMc0tleSk7XG5cdFx0XHRjb25zdCBsYXN0TWVVc2VybmFtZTogc3RyaW5nID0gdGhpcy5zdG9yYWdlU2VydmljZS5nZXQodGhpcy5jb25maWcubGFzdE1lVXNlcm5hbWVMc0tleSk7XG5cdFx0XHRjb25zdCBjb21wbGV0ZU9ic2VydmFibGU6IEZ1bmN0aW9uID0gKHJlc3VsdDogYm9vbGVhbikgPT4ge1xuXHRcdFx0XHRvYnNlcnZlci5uZXh0KHJlc3VsdCk7XG5cdFx0XHRcdG9ic2VydmVyLmNvbXBsZXRlKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBMb2FkIGxhc3QgdXNlclxuXHRcdFx0aWYgKGxhc3RNZVVzZXJuYW1lIHx8IGxhc3RNZVVzZXJuYW1lKSB7XG5cdFx0XHRcdHRoaXMubGFzdE1lID0gbmV3IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbChcblx0XHRcdFx0XHRsYXN0TWVVc2VybmFtZSxcblx0XHRcdFx0XHRsYXN0TWVBdmF0YXJcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubGFzdE1lID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hlY2sgYWNjZXNzIHRva2VuIGdldHRlZCBmcm9tIGxzXG5cdFx0XHRpZiAoYWNjZXNzVG9rZW5Mcykge1xuXHRcdFx0XHQvLyBDcmVhdCBhY2Nlc3MgdG9rZW5cblx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMucGFyc2VBY2Nlc3NUb2tlbihhY2Nlc3NUb2tlbkxzKTtcblxuXHRcdFx0XHQvLyBDaGVjayB0b2tlblxuXHRcdFx0XHRpZiAodGhpcy5hY2Nlc3NUb2tlbiBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKSB7XG5cdFx0XHRcdFx0Ly8gSGFzIGNvbmZpZ3VyZWQgbWVcblx0XHRcdFx0XHRpZiAodGhpcy5jb25maWcub2F1dGhNZVVyaSkge1xuXHRcdFx0XHRcdFx0Ly8gTG9hZCB0byBhcGlTZXJ2aWNlIHRvXG5cdFx0XHRcdFx0XHR0aGlzLmFwaVNlcnZpY2Uuc2V0QWNjZXNzVG9rZW4odGhpcy5hY2Nlc3NUb2tlbi50b2tlbik7XG5cblx0XHRcdFx0XHRcdC8vIFJlcXVlc3QgbWUgaW5mb1xuXHRcdFx0XHRcdFx0dGhpcy5yZXF1ZXN0TWUoKS5zdWJzY3JpYmUoXG5cdFx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHQvLyBOb3RpZnkgdXNlciBzdGF0ZVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBGaW5pc2ggbG9hZFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZSh0cnVlKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdC8vIEZpbmlzaCBsb2FkXG5cdFx0XHRcdFx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gTG9hZCBzdWNjZXNzIHdpdGhvdXQgbWVcblx0XHRcdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZSh0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRmluaXNoIGxvYWRcblx0XHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaW5pc2ggbG9hZFxuXHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvYnM7XG5cdH1cblxuXHRwdWJsaWMgbG9nb3V0KCk6IHZvaWQge1xuXHRcdC8vIENsZWFyIExvY2FsIHN0b3JhZ2Vcblx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSh0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbkxzS2V5KTtcblxuXHRcdC8vIENsZWFyIGRhdGEgaW4gbWVtb3J5XG5cdFx0dGhpcy5tZSA9IG51bGw7XG5cdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG5cblx0XHQvLyBFbWl0IHN0YXRlIGNoYW5nZVxuXHRcdHRoaXMuY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk7XG5cdH1cblxuXHRwdWJsaWMgY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLm1lIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3Vlek1lTW9kZWwgJiYgdGhpcy5hY2Nlc3NUb2tlbiBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKSB7XG5cdFx0XHQvLyBFbWl0IGxvZ2luIGV2ZW50XG5cdFx0XHR0aGlzLm9uU2Vzc2lvblN0YXRlQ2hhbmdlLmVtaXQodHJ1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEVtaXQgbG9naW4gZXZlbnRcblx0XHRcdHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2UuZW1pdChmYWxzZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZU1lKG1lOiBOZ3hHdXN0YXZndWV6TWVNb2RlbCk6IHZvaWQge1xuXHRcdHRoaXMubWUgPSBtZTtcblxuXHRcdC8vIEVtaXQgY2hhbmdlXG5cdFx0dGhpcy5vbk1lQ2hhbmdlZC5lbWl0KG1lKTtcblx0fVxuXG5cdC8vIFByaXZhdGUgbWV0aG9kc1xuXHRwcml2YXRlIHBhcnNlQWNjZXNzVG9rZW4oanNvbjogYW55KTogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwge1xuXHRcdGxldCBhY2Nlc3NUb2tlbjogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwgPSBudWxsO1xuXG5cdFx0Ly8gQ2hlY2sgYWNjZXNzIHRva2VuXG5cdFx0aWYgKGpzb24gJiYganNvbi5hY2Nlc3NfdG9rZW4pIHtcblx0XHRcdC8vIHBhcnNlIGV4cGlyYXRpb24gZGF0ZVxuXHRcdFx0Y29uc3QgZXhwaXJhdGlvbjogRGF0ZSA9IG5ldyBEYXRlKCk7XG5cdFx0XHRjb25zdCBleHBpcmVzSW46IG51bWJlciA9IGpzb24uZXhwaXJlc19pbiAvIDYwO1xuXHRcdFx0ZXhwaXJhdGlvbi5zZXRNaW51dGVzKGV4cGlyYXRpb24uZ2V0TWludXRlcygpICsgZXhwaXJlc0luKTtcblxuXHRcdFx0Ly8gQ3JlYXRlcyB0aGUgYWNjZXNzIHRva2VuIG1vZGVsXG5cdFx0XHRhY2Nlc3NUb2tlbiA9IG5ldyBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbChcblx0XHRcdFx0anNvbi5hY2Nlc3NfdG9rZW4sXG5cdFx0XHRcdGpzb24ucmVmcmVzaF90b2tlbixcblx0XHRcdFx0ZXhwaXJhdGlvblxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFjY2Vzc1Rva2VuO1xuXHR9XG59XG4iXX0=