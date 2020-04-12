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
                return this.parseAccessToken(response);
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
                        // Load response
                        observer.next(true);
                        observer.complete();
                    }, () => {
                        // Rise error
                        observer.error(response);
                    });
                }
                else {
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
            return this.me;
        }));
    }
    refreshToken() {
        // Get refresh token
        const refreshToken = this.accessToken instanceof NgxGustavguezAccessTokenModel ? this.accessToken.refreshToken : '';
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
            this.accessToken = this.parseAccessToken(response);
            // Load to apiService to
            this.apiService.setAccessToken(this.accessToken.token);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1c3Rhdmd1ZXotYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQU1qRSxJQUFhLHdCQUF3QixHQUFyQyxNQUFhLHdCQUF3QjtJQWFwQyx1QkFBdUI7SUFDdkIsWUFDUyxjQUFtQyxFQUNuQyxVQUFzQjtRQUR0QixtQkFBYyxHQUFkLGNBQWMsQ0FBcUI7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUM5Qix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFMUMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFFRCxVQUFVO0lBQ0gsU0FBUyxDQUFDLE1BQWdDO1FBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxTQUFTO1FBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxjQUFjO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN6QixDQUFDO0lBRU0sS0FBSztRQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRU0sUUFBUTtRQUNkLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVNLHVCQUF1QjtRQUM3QixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUNsQyxDQUFDO0lBRU0sY0FBYztRQUNwQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDekIsQ0FBQztJQUVNLGFBQWE7UUFDbkIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3hCLENBQUM7SUFFRCwwQkFBMEI7SUFDbkIsS0FBSyxDQUFDLGFBQXFCLEVBQUUsYUFBcUI7UUFDeEQsdUJBQXVCO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFVLENBQUMsUUFBYSxFQUFFLEVBQUU7WUFDckQsZ0JBQWdCO1lBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUMvQyxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7Z0JBQ2pDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7Z0JBQy9CLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVk7YUFDdkMsQ0FBQyxDQUFDLElBQUksQ0FDTixHQUFHLENBQUMsQ0FBQyxRQUEwQixFQUFFLEVBQUU7Z0JBQ2xDLDhCQUE4QjtnQkFDOUIsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO29CQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDckU7Z0JBRUQsaUNBQWlDO2dCQUNqQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUMsQ0FDRixDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQXVDLEVBQUUsRUFBRTtnQkFDdkQsbUJBQW1CO2dCQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztnQkFFNUIsd0JBQXdCO2dCQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUV2RCxjQUFjO2dCQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7b0JBQzNCLGtCQUFrQjtvQkFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FDekIsR0FBRyxFQUFFO3dCQUNKLG9CQUFvQjt3QkFDcEIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7d0JBRTdCLGdCQUFnQjt3QkFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDcEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNyQixDQUFDLEVBQ0QsR0FBRyxFQUFFO3dCQUNKLGFBQWE7d0JBQ2IsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDMUIsQ0FBQyxDQUNELENBQUM7aUJBQ0Y7cUJBQU07b0JBQ04scUJBQXFCO29CQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQ3BCO1lBQ0YsQ0FBQyxFQUFFLENBQUMsUUFBMkIsRUFBRSxFQUFFO2dCQUNsQyxhQUFhO2dCQUNiLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUVELDBCQUEwQjtJQUNuQixTQUFTO1FBQ2YsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FDNUQsR0FBRyxDQUFDLENBQUMsUUFBMEIsRUFBRSxFQUFFO1lBQ2xDLGtCQUFrQjtZQUNsQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRW5DLDBCQUEwQjtZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRS9CLG1CQUFtQjtZQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksd0JBQXdCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztZQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUV4QyxhQUFhO1lBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQ0YsQ0FBQztJQUNILENBQUM7SUFFTSxZQUFZO1FBQ2xCLG9CQUFvQjtRQUNwQixNQUFNLFlBQVksR0FBVyxJQUFJLENBQUMsV0FBVyxZQUFZLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTVILGdCQUFnQjtRQUNoQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3RELGFBQWEsRUFBRSxZQUFZO1lBQzNCLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQjtZQUN4QyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO1NBQy9CLENBQUMsQ0FBQyxJQUFJLENBQ04sR0FBRyxDQUFDLENBQUMsUUFBMEIsRUFBRSxFQUFFO1lBQ2xDLGlCQUFpQjtZQUNqQixJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xCLHlCQUF5QjtnQkFDekIsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO2dCQUUzQyxhQUFhO2dCQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JFO1lBRUQsaUNBQWlDO1lBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRW5ELHdCQUF3QjtZQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXZELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FDRixDQUFDO0lBQ0gsQ0FBQztJQUVNLFdBQVc7UUFDakIsdUJBQXVCO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFVLENBQUMsUUFBYSxFQUFFLEVBQUU7WUFDckQsTUFBTSxhQUFhLEdBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNwRixNQUFNLGNBQWMsR0FBVyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDeEYsTUFBTSxrQkFBa0IsR0FBYSxDQUFDLE1BQWUsRUFBRSxFQUFFO2dCQUN4RCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0QixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDO1lBRUYsaUJBQWlCO1lBQ2pCLElBQUksY0FBYyxJQUFJLGNBQWMsRUFBRTtnQkFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHdCQUF3QixDQUN6QyxjQUFjLEVBQ2QsWUFBWSxDQUNaLENBQUM7YUFDRjtpQkFBTTtnQkFDTixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzthQUNuQjtZQUVELG9DQUFvQztZQUNwQyxJQUFJLGFBQWEsRUFBRTtnQkFDbEIscUJBQXFCO2dCQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFeEQsY0FBYztnQkFDZCxJQUFJLElBQUksQ0FBQyxXQUFXLFlBQVksNkJBQTZCLEVBQUU7b0JBQzlELG9CQUFvQjtvQkFDcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTt3QkFDM0Isa0JBQWtCO3dCQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUN6QixHQUFHLEVBQUU7NEJBQ0osb0JBQW9COzRCQUNwQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs0QkFFN0IsY0FBYzs0QkFDZCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDMUIsQ0FBQyxFQUNELEdBQUcsRUFBRTs0QkFDSixjQUFjOzRCQUNkLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMzQixDQUFDLENBQ0QsQ0FBQztxQkFDRjt5QkFBTTt3QkFDTiwwQkFBMEI7d0JBQzFCLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN6QjtpQkFDRDtxQkFBTTtvQkFDTixjQUFjO29CQUNkLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMxQjthQUNEO2lCQUFNO2dCQUNOLGNBQWM7Z0JBQ2Qsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDMUI7UUFDRixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUVNLE1BQU07UUFDWixzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXpELHVCQUF1QjtRQUN2QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNmLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXhCLG9CQUFvQjtRQUNwQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRU0scUJBQXFCO1FBQzNCLElBQUksSUFBSSxDQUFDLEVBQUUsWUFBWSxvQkFBb0IsSUFBSSxJQUFJLENBQUMsV0FBVyxZQUFZLDZCQUE2QixFQUFFO1lBQ3pHLG1CQUFtQjtZQUNuQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDTixtQkFBbUI7WUFDbkIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QztJQUNGLENBQUM7SUFFTSxRQUFRLENBQUMsRUFBd0I7UUFDdkMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFFYixjQUFjO1FBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELGtCQUFrQjtJQUNWLGdCQUFnQixDQUFDLElBQVM7UUFDakMsSUFBSSxXQUFXLEdBQWtDLElBQUksQ0FBQztRQUV0RCxxQkFBcUI7UUFDckIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUM5Qix3QkFBd0I7WUFDeEIsTUFBTSxVQUFVLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNwQyxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUMvQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUUzRCxpQ0FBaUM7WUFDakMsV0FBVyxHQUFHLElBQUksNkJBQTZCLENBQzlDLElBQUksQ0FBQyxZQUFZLEVBQ2pCLElBQUksQ0FBQyxhQUFhLEVBQ2xCLFVBQVUsQ0FDVixDQUFDO1NBQ0Y7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNwQixDQUFDO0NBQ0QsQ0FBQTs7WUEzUXlCLG1CQUFtQjtZQUN2QixVQUFVOzs7QUFoQm5CLHdCQUF3QjtJQUhwQyxVQUFVLENBQUM7UUFDWCxVQUFVLEVBQUUsTUFBTTtLQUNsQixDQUFDO0dBQ1csd0JBQXdCLENBMFJwQztTQTFSWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICdhbmd1bGFyLTItbG9jYWwtc3RvcmFnZSc7XG5pbXBvcnQgeyBBcGlTZXJ2aWNlLCBBcGlSZXNwb25zZU1vZGVsIH0gZnJvbSAnbmd4LWd1c3Rhdmd1ZXotY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpDb25maWdNb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotY29uZmlnLm1vZGVsJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1hY2Nlc3MtdG9rZW4ubW9kZWwnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1sYXN0LW1lLm1vZGVsJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpNZU1vZGVsIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1tZS5tb2RlbCc7XG5pbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuQEluamVjdGFibGUoe1xuXHRwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIE5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZSB7XG5cblx0Ly8gTW9kZWxzXG5cdHByaXZhdGUgbWU6IE5neEd1c3Rhdmd1ZXpNZU1vZGVsO1xuXHRwcml2YXRlIGNvbmZpZzogTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsO1xuXHRwcml2YXRlIGxhc3RNZTogTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsO1xuXHRwcml2YXRlIGFjY2Vzc1Rva2VuOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbDtcblxuXHQvLyBVc2VyIHNlc3Npb24gZXZlbnRzIGVtaXR0ZXJzXG5cdHByaXZhdGUgb25TZXNzaW9uU3RhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcblx0cHJpdmF0ZSBvbk1lUGFyc2VkOiBFdmVudEVtaXR0ZXI8YW55Pjtcblx0cHJpdmF0ZSBvbk1lQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPjtcblxuXHQvLyBTZXJ2aWNlIGNvbnN0cnVjdHVyZVxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHN0b3JhZ2VTZXJ2aWNlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlLFxuXHRcdHByaXZhdGUgYXBpU2VydmljZTogQXBpU2VydmljZSkge1xuXHRcdC8vIENyZWF0ZSBldmVudCBlbWl0dGVyc1xuXHRcdHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cdFx0dGhpcy5vbk1lQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4R3VzdGF2Z3Vlek1lTW9kZWw+KCk7XG5cdFx0dGhpcy5vbk1lUGFyc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cblx0XHQvLyBEZWZhdWx0IHZhbHVlc1xuXHRcdHRoaXMuY29uZmlnID0gbmV3IE5neEd1c3Rhdmd1ZXpDb25maWdNb2RlbCgpO1xuXHR9XG5cblx0Ly8gTWV0aG9kc1xuXHRwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsKTogdm9pZCB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TGFzdE1lKCk6IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMubGFzdE1lO1xuXHR9XG5cblx0cHVibGljIGdldEFjY2Vzc1Rva2VuKCk6IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsIHtcblx0XHRyZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbjtcblx0fVxuXG5cdHB1YmxpYyBnZXRNZSgpOiBOZ3hHdXN0YXZndWV6TWVNb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMubWU7XG5cdH1cblxuXHRwdWJsaWMgaXNMb2dnZWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuICEhdGhpcy5tZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRPblNlc3Npb25TdGF0ZUNoYW5nZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHRyZXR1cm4gdGhpcy5vblNlc3Npb25TdGF0ZUNoYW5nZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRPbk1lQ2hhbmdlZCgpOiBPYnNlcnZhYmxlPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPiB7XG5cdFx0cmV0dXJuIHRoaXMub25NZUNoYW5nZWQ7XG5cdH1cblxuXHRwdWJsaWMgZ2V0T25NZVBhcnNlZCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuXHRcdHJldHVybiB0aGlzLm9uTWVQYXJzZWQ7XG5cdH1cblxuXHQvLyBHZW5lcmF0ZSBhIGFjY2VzcyB0b2tlblxuXHRwdWJsaWMgbG9naW4obG9naW5Vc2VybmFtZTogc3RyaW5nLCBsb2dpblBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHQvLyBDcmVhdGUgYW4gb2JzZXJ2YWJsZVxuXHRcdGNvbnN0IG9icyA9IG5ldyBPYnNlcnZhYmxlPGJvb2xlYW4+KChvYnNlcnZlcjogYW55KSA9PiB7XG5cdFx0XHQvLyBSZXF1ZXN0IHRva2VuXG5cdFx0XHR0aGlzLmFwaVNlcnZpY2UuY3JlYXRlT2JqKHRoaXMuY29uZmlnLm9hdXRoVXJpLCB7XG5cdFx0XHRcdHVzZXJuYW1lOiBsb2dpblVzZXJuYW1lLFxuXHRcdFx0XHRwYXNzd29yZDogbG9naW5QYXNzd29yZCxcblx0XHRcdFx0Z3JhbnRfdHlwZTogdGhpcy5jb25maWcuZ3JhbnRUeXBlLFxuXHRcdFx0XHRjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmNsaWVudElkLFxuXHRcdFx0XHRjbGllbnRfc2VjcmV0OiB0aGlzLmNvbmZpZy5jbGllbnRTZWNyZXRcblx0XHRcdH0pLnBpcGUoXG5cdFx0XHRcdG1hcCgocmVzcG9uc2U6IEFwaVJlc3BvbnNlTW9kZWwpID0+IHtcblx0XHRcdFx0XHQvLyBTYXZlIHRva2VuIHRvIExvY2FsIHN0b3JhZ2Vcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zZXQodGhpcy5jb25maWcuYWNjZXNzVG9rZW5Mc0tleSwgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gQ3JlYXRlcyB0aGUgYWNjZXNzIHRva2VuIG1vZGVsXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMucGFyc2VBY2Nlc3NUb2tlbihyZXNwb25zZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHQpLnN1YnNjcmliZSgocmVzcG9uc2U6IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKSA9PiB7XG5cdFx0XHRcdC8vIExvYWQgYWNjZXNzdG9rZW5cblx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IHJlc3BvbnNlO1xuXG5cdFx0XHRcdC8vIExvYWQgdG8gYXBpU2VydmljZSB0b1xuXHRcdFx0XHR0aGlzLmFwaVNlcnZpY2Uuc2V0QWNjZXNzVG9rZW4odGhpcy5hY2Nlc3NUb2tlbi50b2tlbik7XG5cblx0XHRcdFx0Ly8gQ2hlY2sgbWVVcmxcblx0XHRcdFx0aWYgKHRoaXMuY29uZmlnLm9hdXRoTWVVcmkpIHtcblx0XHRcdFx0XHQvLyBSZXF1ZXN0IG1lIGluZm9cblx0XHRcdFx0XHR0aGlzLnJlcXVlc3RNZSgpLnN1YnNjcmliZShcblx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0Ly8gTm90aWZ5IHVzZXIgc3RhdGVcblx0XHRcdFx0XHRcdFx0dGhpcy5jaGVja0FuZE5vdGlmeU1lU3RhdGUoKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBMb2FkIHJlc3BvbnNlXG5cdFx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdG9ic2VydmVyLmNvbXBsZXRlKCk7XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHQvLyBSaXNlIGVycm9yXG5cdFx0XHRcdFx0XHRcdG9ic2VydmVyLmVycm9yKHJlc3BvbnNlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIENvbXBsZXRlIHN1YnNjcmliZVxuXHRcdFx0XHRcdG9ic2VydmVyLm5leHQodHJ1ZSk7XG5cdFx0XHRcdFx0b2JzZXJ2ZXIuY29tcGxldGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgKHJlc3BvbnNlOiBIdHRwRXJyb3JSZXNwb25zZSkgPT4ge1xuXHRcdFx0XHQvLyBSaXNlIGVycm9yXG5cdFx0XHRcdG9ic2VydmVyLmVycm9yKHJlc3BvbnNlKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBvYnM7XG5cdH1cblxuXHQvLyBHZW5lcmF0ZSBhIGFjY2VzcyB0b2tlblxuXHRwdWJsaWMgcmVxdWVzdE1lKCk6IE9ic2VydmFibGU8Tmd4R3VzdGF2Z3Vlek1lTW9kZWw+IHtcblx0XHRyZXR1cm4gdGhpcy5hcGlTZXJ2aWNlLmZldGNoRGF0YSh0aGlzLmNvbmZpZy5vYXV0aE1lVXJpKS5waXBlKFxuXHRcdFx0bWFwKChyZXNwb25zZTogQXBpUmVzcG9uc2VNb2RlbCkgPT4ge1xuXHRcdFx0XHQvLyBMb2FkIHVzZXJMb2dnZWRcblx0XHRcdFx0dGhpcy5tZSA9IG5ldyBOZ3hHdXN0YXZndWV6TWVNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1lLmZyb21KU09OKHJlc3BvbnNlLmRhdGEubWUpO1xuXG5cdFx0XHRcdC8vIEVtaXQgcGFyc2VkIGFuZCBjaGFuZ2VkXG5cdFx0XHRcdHRoaXMub25NZVBhcnNlZC5lbWl0KHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0XHR0aGlzLm9uTWVDaGFuZ2VkLmVtaXQodGhpcy5tZSk7XG5cblx0XHRcdFx0Ly8gTG9hZCB1c2VyIGxvZ2dlZFxuXHRcdFx0XHR0aGlzLmxhc3RNZSA9IG5ldyBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwoKTtcblx0XHRcdFx0dGhpcy5sYXN0TWUuYXZhdGFyID0gdGhpcy5tZS5wcm9maWxlSW1hZ2U7XG5cdFx0XHRcdHRoaXMubGFzdE1lLnVzZXJuYW1lID0gdGhpcy5tZS51c2VybmFtZTtcblxuXHRcdFx0XHQvLyBTYXZlIHRvIExTXG5cdFx0XHRcdHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0KHRoaXMuY29uZmlnLmxhc3RNZUF2YXRhckxzS2V5LCB0aGlzLm1lLnByb2ZpbGVJbWFnZSk7XG5cdFx0XHRcdHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0KHRoaXMuY29uZmlnLmxhc3RNZVVzZXJuYW1lTHNLZXksIHRoaXMubWUudXNlcm5hbWUpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tZTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyByZWZyZXNoVG9rZW4oKTogT2JzZXJ2YWJsZTxOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbD4ge1xuXHRcdC8vIEdldCByZWZyZXNoIHRva2VuXG5cdFx0Y29uc3QgcmVmcmVzaFRva2VuOiBzdHJpbmcgPSB0aGlzLmFjY2Vzc1Rva2VuIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwgPyB0aGlzLmFjY2Vzc1Rva2VuLnJlZnJlc2hUb2tlbiA6ICcnO1xuXG5cdFx0Ly8gUmVxdWVzdCB0b2tlblxuXHRcdHJldHVybiB0aGlzLmFwaVNlcnZpY2UuY3JlYXRlT2JqKHRoaXMuY29uZmlnLm9hdXRoVXJpLCB7XG5cdFx0XHRyZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG5cdFx0XHRncmFudF90eXBlOiB0aGlzLmNvbmZpZy5ncmFudFR5cGVSZWZyZXNoLFxuXHRcdFx0Y2xpZW50X2lkOiB0aGlzLmNvbmZpZy5jbGllbnRJZFxuXHRcdH0pLnBpcGUoXG5cdFx0XHRtYXAoKHJlc3BvbnNlOiBBcGlSZXNwb25zZU1vZGVsKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHJlc3BvbnNlXG5cdFx0XHRcdGlmIChyZXNwb25zZS5kYXRhKSB7XG5cdFx0XHRcdFx0Ly8gTG9hZCB0aGUgcmVmcmVzaCB0b2tlblxuXHRcdFx0XHRcdHJlc3BvbnNlLmRhdGEucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hUb2tlbjtcblxuXHRcdFx0XHRcdC8vIFNhdmUgdG8gTFNcblx0XHRcdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldCh0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbkxzS2V5LCByZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENyZWF0ZXMgdGhlIGFjY2VzcyB0b2tlbiBtb2RlbFxuXHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gdGhpcy5wYXJzZUFjY2Vzc1Rva2VuKHJlc3BvbnNlKTtcblxuXHRcdFx0XHQvLyBMb2FkIHRvIGFwaVNlcnZpY2UgdG9cblx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnNldEFjY2Vzc1Rva2VuKHRoaXMuYWNjZXNzVG9rZW4udG9rZW4pO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIGxvYWRTZXNzaW9uKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXHRcdC8vIENyZWF0ZSBhbiBvYnNlcnZhYmxlXG5cdFx0Y29uc3Qgb2JzID0gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4oKG9ic2VydmVyOiBhbnkpID0+IHtcblx0XHRcdGNvbnN0IGFjY2Vzc1Rva2VuTHM6IGFueSA9IHRoaXMuc3RvcmFnZVNlcnZpY2UuZ2V0KHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuTHNLZXkpO1xuXHRcdFx0Y29uc3QgbGFzdE1lQXZhdGFyOiBzdHJpbmcgPSB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmdldCh0aGlzLmNvbmZpZy5sYXN0TWVBdmF0YXJMc0tleSk7XG5cdFx0XHRjb25zdCBsYXN0TWVVc2VybmFtZTogc3RyaW5nID0gdGhpcy5zdG9yYWdlU2VydmljZS5nZXQodGhpcy5jb25maWcubGFzdE1lVXNlcm5hbWVMc0tleSk7XG5cdFx0XHRjb25zdCBjb21wbGV0ZU9ic2VydmFibGU6IEZ1bmN0aW9uID0gKHJlc3VsdDogYm9vbGVhbikgPT4ge1xuXHRcdFx0XHRvYnNlcnZlci5uZXh0KHJlc3VsdCk7XG5cdFx0XHRcdG9ic2VydmVyLmNvbXBsZXRlKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBMb2FkIGxhc3QgdXNlclxuXHRcdFx0aWYgKGxhc3RNZVVzZXJuYW1lIHx8IGxhc3RNZVVzZXJuYW1lKSB7XG5cdFx0XHRcdHRoaXMubGFzdE1lID0gbmV3IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbChcblx0XHRcdFx0XHRsYXN0TWVVc2VybmFtZSxcblx0XHRcdFx0XHRsYXN0TWVBdmF0YXJcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubGFzdE1lID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hlY2sgYWNjZXNzIHRva2VuIGdldHRlZCBmcm9tIGxzXG5cdFx0XHRpZiAoYWNjZXNzVG9rZW5Mcykge1xuXHRcdFx0XHQvLyBDcmVhdCBhY2Nlc3MgdG9rZW5cblx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMucGFyc2VBY2Nlc3NUb2tlbihhY2Nlc3NUb2tlbkxzKTtcblxuXHRcdFx0XHQvLyBDaGVjayB0b2tlblxuXHRcdFx0XHRpZiAodGhpcy5hY2Nlc3NUb2tlbiBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKSB7XG5cdFx0XHRcdFx0Ly8gSGFzIGNvbmZpZ3VyZWQgbWVcblx0XHRcdFx0XHRpZiAodGhpcy5jb25maWcub2F1dGhNZVVyaSkge1xuXHRcdFx0XHRcdFx0Ly8gUmVxdWVzdCBtZSBpbmZvXG5cdFx0XHRcdFx0XHR0aGlzLnJlcXVlc3RNZSgpLnN1YnNjcmliZShcblx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdC8vIE5vdGlmeSB1c2VyIHN0YXRlXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5jaGVja0FuZE5vdGlmeU1lU3RhdGUoKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEZpbmlzaCBsb2FkXG5cdFx0XHRcdFx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKHRydWUpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmluaXNoIGxvYWRcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBMb2FkIHN1Y2Nlc3Mgd2l0aG91dCBtZVxuXHRcdFx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBGaW5pc2ggbG9hZFxuXHRcdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZShmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbmlzaCBsb2FkXG5cdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZShmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG9icztcblx0fVxuXG5cdHB1YmxpYyBsb2dvdXQoKTogdm9pZCB7XG5cdFx0Ly8gQ2xlYXIgTG9jYWwgc3RvcmFnZVxuXHRcdHRoaXMuc3RvcmFnZVNlcnZpY2UucmVtb3ZlKHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuTHNLZXkpO1xuXG5cdFx0Ly8gQ2xlYXIgZGF0YSBpbiBtZW1vcnlcblx0XHR0aGlzLm1lID0gbnVsbDtcblx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcblxuXHRcdC8vIEVtaXQgc3RhdGUgY2hhbmdlXG5cdFx0dGhpcy5jaGVja0FuZE5vdGlmeU1lU3RhdGUoKTtcblx0fVxuXG5cdHB1YmxpYyBjaGVja0FuZE5vdGlmeU1lU3RhdGUoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubWUgaW5zdGFuY2VvZiBOZ3hHdXN0YXZndWV6TWVNb2RlbCAmJiB0aGlzLmFjY2Vzc1Rva2VuIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwpIHtcblx0XHRcdC8vIEVtaXQgbG9naW4gZXZlbnRcblx0XHRcdHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2UuZW1pdCh0cnVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRW1pdCBsb2dpbiBldmVudFxuXHRcdFx0dGhpcy5vblNlc3Npb25TdGF0ZUNoYW5nZS5lbWl0KGZhbHNlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlTWUobWU6IE5neEd1c3Rhdmd1ZXpNZU1vZGVsKTogdm9pZCB7XG5cdFx0dGhpcy5tZSA9IG1lO1xuXG5cdFx0Ly8gRW1pdCBjaGFuZ2Vcblx0XHR0aGlzLm9uTWVDaGFuZ2VkLmVtaXQobWUpO1xuXHR9XG5cblx0Ly8gUHJpdmF0ZSBtZXRob2RzXG5cdHByaXZhdGUgcGFyc2VBY2Nlc3NUb2tlbihqc29uOiBhbnkpOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCB7XG5cdFx0bGV0IGFjY2Vzc1Rva2VuOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCA9IG51bGw7XG5cblx0XHQvLyBDaGVjayBhY2Nlc3MgdG9rZW5cblx0XHRpZiAoanNvbiAmJiBqc29uLmFjY2Vzc190b2tlbikge1xuXHRcdFx0Ly8gcGFyc2UgZXhwaXJhdGlvbiBkYXRlXG5cdFx0XHRjb25zdCBleHBpcmF0aW9uOiBEYXRlID0gbmV3IERhdGUoKTtcblx0XHRcdGNvbnN0IGV4cGlyZXNJbjogbnVtYmVyID0ganNvbi5leHBpcmVzX2luIC8gNjA7XG5cdFx0XHRleHBpcmF0aW9uLnNldE1pbnV0ZXMoZXhwaXJhdGlvbi5nZXRNaW51dGVzKCkgKyBleHBpcmVzSW4pO1xuXG5cdFx0XHQvLyBDcmVhdGVzIHRoZSBhY2Nlc3MgdG9rZW4gbW9kZWxcblx0XHRcdGFjY2Vzc1Rva2VuID0gbmV3IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKFxuXHRcdFx0XHRqc29uLmFjY2Vzc190b2tlbixcblx0XHRcdFx0anNvbi5yZWZyZXNoX3Rva2VuLFxuXHRcdFx0XHRleHBpcmF0aW9uXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYWNjZXNzVG9rZW47XG5cdH1cbn1cbiJdfQ==