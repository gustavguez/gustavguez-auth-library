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
var NgxGustavguezAuthService = /** @class */ (function () {
    // Service constructure
    function NgxGustavguezAuthService(storageService, apiService) {
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
    NgxGustavguezAuthService.prototype.setConfig = function (config) {
        this.config = config;
    };
    NgxGustavguezAuthService.prototype.getLastMe = function () {
        return this.lastMe;
    };
    NgxGustavguezAuthService.prototype.getAccessToken = function () {
        return this.accessToken;
    };
    NgxGustavguezAuthService.prototype.getMe = function () {
        return this.me;
    };
    NgxGustavguezAuthService.prototype.getMeJsonResponse = function () {
        return this.meJsonResponse;
    };
    NgxGustavguezAuthService.prototype.isLogged = function () {
        return !!this.me;
    };
    NgxGustavguezAuthService.prototype.getOnSessionStateChange = function () {
        return this.onSessionStateChange;
    };
    NgxGustavguezAuthService.prototype.getOnMeChanged = function () {
        return this.onMeChanged;
    };
    NgxGustavguezAuthService.prototype.getOnMeParsed = function () {
        return this.onMeParsed;
    };
    // Generate a access token
    NgxGustavguezAuthService.prototype.login = function (loginUsername, loginPassword) {
        var _this = this;
        // Create an observable
        var obs = new Observable(function (observer) {
            // Set root strategy
            _this.apiService.changeApiResponseStrategy('root');
            // Request token
            _this.apiService.createObj(_this.config.oauthUri, {
                username: loginUsername,
                password: loginPassword,
                grant_type: _this.config.grantType,
                client_id: _this.config.clientId,
                client_secret: _this.config.clientSecret
            }).pipe(map(function (response) {
                // Save token to Local storage
                if (response.data) {
                    _this.storageService.set(_this.config.accessTokenLsKey, response.data);
                }
                // Creates the access token model
                return _this.parseAccessToken(response.data);
            })).subscribe(function (response) {
                // Load accesstoken
                _this.accessToken = response;
                // Load to apiService to
                _this.apiService.setAccessToken(_this.accessToken.token);
                // Check meUrl
                if (_this.config.oauthMeUri) {
                    // Request me info
                    _this.requestMe().subscribe(function () {
                        // Notify user state
                        _this.checkAndNotifyMeState();
                        // Restore
                        _this.apiService.restoreApiResponseStrategy();
                        // Load response
                        observer.next(true);
                        observer.complete();
                    }, function () {
                        // Rise error
                        observer.error(response);
                    });
                }
                else {
                    // Restore
                    _this.apiService.restoreApiResponseStrategy();
                    // Complete subscribe
                    observer.next(true);
                    observer.complete();
                }
            }, function (response) {
                // Rise error
                observer.error(response);
            });
        });
        return obs;
    };
    // Generate a access token
    NgxGustavguezAuthService.prototype.requestMe = function () {
        var _this = this;
        // Set root strategy
        this.apiService.changeApiResponseStrategy('data');
        // Do request
        return this.apiService.fetchData(this.config.oauthMeUri).pipe(map(function (response) {
            // Load userLogged
            _this.me = new NgxGustavguezMeModel();
            _this.me.fromJSON(response.data.me);
            // Load me response
            _this.meJsonResponse = response.data;
            // Emit parsed and changed
            _this.onMeParsed.emit(response.data);
            _this.onMeChanged.emit(_this.me);
            // Load user logged
            _this.lastMe = new NgxGustavguezLastMeModel();
            _this.lastMe.avatar = _this.me.profileImage;
            _this.lastMe.username = _this.me.username;
            // Save to LS
            _this.storageService.set(_this.config.lastMeAvatarLsKey, _this.me.profileImage);
            _this.storageService.set(_this.config.lastMeUsernameLsKey, _this.me.username);
            // Restore
            _this.apiService.restoreApiResponseStrategy();
            return _this.me;
        }));
    };
    NgxGustavguezAuthService.prototype.refreshToken = function () {
        var _this = this;
        // Get refresh token
        var refreshToken = this.accessToken instanceof NgxGustavguezAccessTokenModel ? this.accessToken.refreshToken : '';
        // Set root strategy
        this.apiService.changeApiResponseStrategy('root');
        // Request token
        return this.apiService.createObj(this.config.oauthUri, {
            refresh_token: refreshToken,
            grant_type: this.config.grantTypeRefresh,
            client_id: this.config.clientId
        }).pipe(map(function (response) {
            // Check response
            if (response.data) {
                // Load the refresh token
                response.data.refresh_token = refreshToken;
                // Save to LS
                _this.storageService.set(_this.config.accessTokenLsKey, response.data);
            }
            // Creates the access token model
            _this.accessToken = _this.parseAccessToken(response.data);
            // Load to apiService to
            _this.apiService.setAccessToken(_this.accessToken.token);
            // Restore
            _this.apiService.restoreApiResponseStrategy();
            return _this.accessToken;
        }));
    };
    NgxGustavguezAuthService.prototype.loadSession = function () {
        var _this = this;
        // Create an observable
        var obs = new Observable(function (observer) {
            var accessTokenLs = _this.storageService.get(_this.config.accessTokenLsKey);
            var lastMeAvatar = _this.storageService.get(_this.config.lastMeAvatarLsKey);
            var lastMeUsername = _this.storageService.get(_this.config.lastMeUsernameLsKey);
            var completeObservable = function (result) {
                observer.next(result);
                observer.complete();
            };
            // Load last user
            if (lastMeUsername || lastMeUsername) {
                _this.lastMe = new NgxGustavguezLastMeModel(lastMeUsername, lastMeAvatar);
            }
            else {
                _this.lastMe = null;
            }
            // Check access token getted from ls
            if (accessTokenLs) {
                // Creat access token
                _this.accessToken = _this.parseAccessToken(accessTokenLs);
                // Check token
                if (_this.accessToken instanceof NgxGustavguezAccessTokenModel) {
                    // Has configured me
                    if (_this.config.oauthMeUri) {
                        // Load to apiService to
                        _this.apiService.setAccessToken(_this.accessToken.token);
                        // Request me info
                        _this.requestMe().subscribe(function () {
                            // Notify user state
                            _this.checkAndNotifyMeState();
                            // Finish load
                            completeObservable(true);
                        }, function () {
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
    };
    NgxGustavguezAuthService.prototype.logout = function () {
        // Clear Local storage
        this.storageService.remove(this.config.accessTokenLsKey);
        // Clear data in memory
        this.me = null;
        this.accessToken = null;
        // Emit state change
        this.checkAndNotifyMeState();
    };
    NgxGustavguezAuthService.prototype.checkAndNotifyMeState = function () {
        if (this.me instanceof NgxGustavguezMeModel && this.accessToken instanceof NgxGustavguezAccessTokenModel) {
            // Emit login event
            this.onSessionStateChange.emit(true);
        }
        else {
            // Emit login event
            this.onSessionStateChange.emit(false);
        }
    };
    NgxGustavguezAuthService.prototype.updateMe = function (me) {
        this.me = me;
        // Emit change
        this.onMeChanged.emit(me);
    };
    // Private methods
    NgxGustavguezAuthService.prototype.parseAccessToken = function (json) {
        var accessToken = null;
        // Check access token
        if (json && json.access_token) {
            // parse expiration date
            var expiration = new Date();
            var expiresIn = json.expires_in / 60;
            expiration.setMinutes(expiration.getMinutes() + expiresIn);
            // Creates the access token model
            accessToken = new NgxGustavguezAccessTokenModel(json.access_token, json.refresh_token, expiration);
        }
        return accessToken;
    };
    NgxGustavguezAuthService.ctorParameters = function () { return [
        { type: LocalStorageService },
        { type: ApiService }
    ]; };
    NgxGustavguezAuthService.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgxGustavguezAuthService_Factory() { return new NgxGustavguezAuthService(i0.ɵɵinject(i1.LocalStorageService), i0.ɵɵinject(i2.ApiService)); }, token: NgxGustavguezAuthService, providedIn: "root" });
    NgxGustavguezAuthService = __decorate([
        Injectable({
            providedIn: 'root',
        })
    ], NgxGustavguezAuthService);
    return NgxGustavguezAuthService;
}());
export { NgxGustavguezAuthService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1c3Rhdmd1ZXotYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQU1qRTtJQWNDLHVCQUF1QjtJQUN2QixrQ0FDUyxjQUFtQyxFQUNuQyxVQUFzQjtRQUR0QixtQkFBYyxHQUFkLGNBQWMsQ0FBcUI7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUM5Qix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFMUMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFD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QyxJQUFJLFdBQVcsR0FBa0MsSUFBSSxDQUFDO1FBRXRELHFCQUFxQjtRQUNyQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQzlCLHdCQUF3QjtZQUN4QixJQUFNLFVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3BDLElBQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBQy9DLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBRTNELGlDQUFpQztZQUNqQyxXQUFXLEdBQUcsSUFBSSw2QkFBNkIsQ0FDOUMsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsVUFBVSxDQUNWLENBQUM7U0FDRjtRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3BCLENBQUM7O2dCQXpTd0IsbUJBQW1CO2dCQUN2QixVQUFVOzs7SUFqQm5CLHdCQUF3QjtRQUhwQyxVQUFVLENBQUM7WUFDWCxVQUFVLEVBQUUsTUFBTTtTQUNsQixDQUFDO09BQ1csd0JBQXdCLENBMFRwQzttQ0F6VUQ7Q0F5VUMsQUExVEQsSUEwVEM7U0ExVFksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnYW5ndWxhci0yLWxvY2FsLXN0b3JhZ2UnO1xuaW1wb3J0IHsgQXBpU2VydmljZSwgQXBpUmVzcG9uc2VNb2RlbCB9IGZyb20gJ25neC1ndXN0YXZndWV6LWNvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6Q29uZmlnTW9kZWwgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotYWNjZXNzLXRva2VuLm1vZGVsJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotbGFzdC1tZS5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6TWVNb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotbWUubW9kZWwnO1xuaW1wb3J0IHsgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbkBJbmplY3RhYmxlKHtcblx0cHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2Uge1xuXG5cdC8vIE1vZGVsc1xuXHRwcml2YXRlIG1lOiBOZ3hHdXN0YXZndWV6TWVNb2RlbDtcblx0cHJpdmF0ZSBtZUpzb25SZXNwb25zZTogYW55O1xuXHRwcml2YXRlIGNvbmZpZzogTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsO1xuXHRwcml2YXRlIGxhc3RNZTogTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsO1xuXHRwcml2YXRlIGFjY2Vzc1Rva2VuOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbDtcblxuXHQvLyBVc2VyIHNlc3Npb24gZXZlbnRzIGVtaXR0ZXJzXG5cdHByaXZhdGUgb25TZXNzaW9uU3RhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcblx0cHJpdmF0ZSBvbk1lUGFyc2VkOiBFdmVudEVtaXR0ZXI8YW55Pjtcblx0cHJpdmF0ZSBvbk1lQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPjtcblxuXHQvLyBTZXJ2aWNlIGNvbnN0cnVjdHVyZVxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHN0b3JhZ2VTZXJ2aWNlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlLFxuXHRcdHByaXZhdGUgYXBpU2VydmljZTogQXBpU2VydmljZSkge1xuXHRcdC8vIENyZWF0ZSBldmVudCBlbWl0dGVyc1xuXHRcdHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cdFx0dGhpcy5vbk1lQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4R3VzdGF2Z3Vlek1lTW9kZWw+KCk7XG5cdFx0dGhpcy5vbk1lUGFyc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cblx0XHQvLyBEZWZhdWx0IHZhbHVlc1xuXHRcdHRoaXMuY29uZmlnID0gbmV3IE5neEd1c3Rhdmd1ZXpDb25maWdNb2RlbCgpO1xuXHR9XG5cblx0Ly8gTWV0aG9kc1xuXHRwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsKTogdm9pZCB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TGFzdE1lKCk6IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMubGFzdE1lO1xuXHR9XG5cblx0cHVibGljIGdldEFjY2Vzc1Rva2VuKCk6IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsIHtcblx0XHRyZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbjtcblx0fVxuXG5cdHB1YmxpYyBnZXRNZSgpOiBOZ3hHdXN0YXZndWV6TWVNb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMubWU7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TWVKc29uUmVzcG9uc2UoKTogYW55IHtcblx0XHRyZXR1cm4gdGhpcy5tZUpzb25SZXNwb25zZTtcblx0fVxuXG5cdHB1YmxpYyBpc0xvZ2dlZCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gISF0aGlzLm1lO1xuXHR9XG5cblx0cHVibGljIGdldE9uU2Vzc2lvblN0YXRlQ2hhbmdlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXHRcdHJldHVybiB0aGlzLm9uU2Vzc2lvblN0YXRlQ2hhbmdlO1xuXHR9XG5cblx0cHVibGljIGdldE9uTWVDaGFuZ2VkKCk6IE9ic2VydmFibGU8Tmd4R3VzdGF2Z3Vlek1lTW9kZWw+IHtcblx0XHRyZXR1cm4gdGhpcy5vbk1lQ2hhbmdlZDtcblx0fVxuXG5cdHB1YmxpYyBnZXRPbk1lUGFyc2VkKCk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0cmV0dXJuIHRoaXMub25NZVBhcnNlZDtcblx0fVxuXG5cdC8vIEdlbmVyYXRlIGEgYWNjZXNzIHRva2VuXG5cdHB1YmxpYyBsb2dpbihsb2dpblVzZXJuYW1lOiBzdHJpbmcsIGxvZ2luUGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXHRcdC8vIENyZWF0ZSBhbiBvYnNlcnZhYmxlXG5cdFx0Y29uc3Qgb2JzID0gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4oKG9ic2VydmVyOiBhbnkpID0+IHtcblx0XHRcdC8vIFNldCByb290IHN0cmF0ZWd5XG5cdFx0XHR0aGlzLmFwaVNlcnZpY2UuY2hhbmdlQXBpUmVzcG9uc2VTdHJhdGVneSgncm9vdCcpO1xuXG5cdFx0XHQvLyBSZXF1ZXN0IHRva2VuXG5cdFx0XHR0aGlzLmFwaVNlcnZpY2UuY3JlYXRlT2JqKHRoaXMuY29uZmlnLm9hdXRoVXJpLCB7XG5cdFx0XHRcdHVzZXJuYW1lOiBsb2dpblVzZXJuYW1lLFxuXHRcdFx0XHRwYXNzd29yZDogbG9naW5QYXNzd29yZCxcblx0XHRcdFx0Z3JhbnRfdHlwZTogdGhpcy5jb25maWcuZ3JhbnRUeXBlLFxuXHRcdFx0XHRjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmNsaWVudElkLFxuXHRcdFx0XHRjbGllbnRfc2VjcmV0OiB0aGlzLmNvbmZpZy5jbGllbnRTZWNyZXRcblx0XHRcdH0pLnBpcGUoXG5cdFx0XHRcdG1hcCgocmVzcG9uc2U6IEFwaVJlc3BvbnNlTW9kZWwpID0+IHtcblx0XHRcdFx0XHQvLyBTYXZlIHRva2VuIHRvIExvY2FsIHN0b3JhZ2Vcblx0XHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YSkge1xuXHRcdFx0XHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zZXQodGhpcy5jb25maWcuYWNjZXNzVG9rZW5Mc0tleSwgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gQ3JlYXRlcyB0aGUgYWNjZXNzIHRva2VuIG1vZGVsXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMucGFyc2VBY2Nlc3NUb2tlbihyZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0fSlcblx0XHRcdCkuc3Vic2NyaWJlKChyZXNwb25zZTogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwpID0+IHtcblx0XHRcdFx0Ly8gTG9hZCBhY2Nlc3N0b2tlblxuXHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gcmVzcG9uc2U7XG5cblx0XHRcdFx0Ly8gTG9hZCB0byBhcGlTZXJ2aWNlIHRvXG5cdFx0XHRcdHRoaXMuYXBpU2VydmljZS5zZXRBY2Nlc3NUb2tlbih0aGlzLmFjY2Vzc1Rva2VuLnRva2VuKTtcblxuXHRcdFx0XHQvLyBDaGVjayBtZVVybFxuXHRcdFx0XHRpZiAodGhpcy5jb25maWcub2F1dGhNZVVyaSkge1xuXHRcdFx0XHRcdC8vIFJlcXVlc3QgbWUgaW5mb1xuXHRcdFx0XHRcdHRoaXMucmVxdWVzdE1lKCkuc3Vic2NyaWJlKFxuXHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHQvLyBOb3RpZnkgdXNlciBzdGF0ZVxuXHRcdFx0XHRcdFx0XHR0aGlzLmNoZWNrQW5kTm90aWZ5TWVTdGF0ZSgpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJlc3RvcmVcblx0XHRcdFx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnJlc3RvcmVBcGlSZXNwb25zZVN0cmF0ZWd5KCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gTG9hZCByZXNwb25zZVxuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5uZXh0KHRydWUpO1xuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5jb21wbGV0ZSgpO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0Ly8gUmlzZSBlcnJvclxuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5lcnJvcihyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBSZXN0b3JlXG5cdFx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnJlc3RvcmVBcGlSZXNwb25zZVN0cmF0ZWd5KCk7XG5cblx0XHRcdFx0XHQvLyBDb21wbGV0ZSBzdWJzY3JpYmVcblx0XHRcdFx0XHRvYnNlcnZlci5uZXh0KHRydWUpO1xuXHRcdFx0XHRcdG9ic2VydmVyLmNvbXBsZXRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIChyZXNwb25zZTogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcblx0XHRcdFx0Ly8gUmlzZSBlcnJvclxuXHRcdFx0XHRvYnNlcnZlci5lcnJvcihyZXNwb25zZSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gb2JzO1xuXHR9XG5cblx0Ly8gR2VuZXJhdGUgYSBhY2Nlc3MgdG9rZW5cblx0cHVibGljIHJlcXVlc3RNZSgpOiBPYnNlcnZhYmxlPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPiB7XG5cdFx0Ly8gU2V0IHJvb3Qgc3RyYXRlZ3lcblx0XHR0aGlzLmFwaVNlcnZpY2UuY2hhbmdlQXBpUmVzcG9uc2VTdHJhdGVneSgnZGF0YScpO1xuXG5cdFx0Ly8gRG8gcmVxdWVzdFxuXHRcdHJldHVybiB0aGlzLmFwaVNlcnZpY2UuZmV0Y2hEYXRhKHRoaXMuY29uZmlnLm9hdXRoTWVVcmkpLnBpcGUoXG5cdFx0XHRtYXAoKHJlc3BvbnNlOiBBcGlSZXNwb25zZU1vZGVsKSA9PiB7XG5cdFx0XHRcdC8vIExvYWQgdXNlckxvZ2dlZFxuXHRcdFx0XHR0aGlzLm1lID0gbmV3IE5neEd1c3Rhdmd1ZXpNZU1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubWUuZnJvbUpTT04ocmVzcG9uc2UuZGF0YS5tZSk7XG5cblx0XHRcdFx0Ly8gTG9hZCBtZSByZXNwb25zZVxuXHRcdFx0XHR0aGlzLm1lSnNvblJlc3BvbnNlID0gcmVzcG9uc2UuZGF0YTtcblxuXHRcdFx0XHQvLyBFbWl0IHBhcnNlZCBhbmQgY2hhbmdlZFxuXHRcdFx0XHR0aGlzLm9uTWVQYXJzZWQuZW1pdChyZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0dGhpcy5vbk1lQ2hhbmdlZC5lbWl0KHRoaXMubWUpO1xuXG5cdFx0XHRcdC8vIExvYWQgdXNlciBsb2dnZWRcblx0XHRcdFx0dGhpcy5sYXN0TWUgPSBuZXcgTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubGFzdE1lLmF2YXRhciA9IHRoaXMubWUucHJvZmlsZUltYWdlO1xuXHRcdFx0XHR0aGlzLmxhc3RNZS51c2VybmFtZSA9IHRoaXMubWUudXNlcm5hbWU7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0byBMU1xuXHRcdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldCh0aGlzLmNvbmZpZy5sYXN0TWVBdmF0YXJMc0tleSwgdGhpcy5tZS5wcm9maWxlSW1hZ2UpO1xuXHRcdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldCh0aGlzLmNvbmZpZy5sYXN0TWVVc2VybmFtZUxzS2V5LCB0aGlzLm1lLnVzZXJuYW1lKTtcblxuXHRcdFx0XHQvLyBSZXN0b3JlXG5cdFx0XHRcdHRoaXMuYXBpU2VydmljZS5yZXN0b3JlQXBpUmVzcG9uc2VTdHJhdGVneSgpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tZTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyByZWZyZXNoVG9rZW4oKTogT2JzZXJ2YWJsZTxOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbD4ge1xuXHRcdC8vIEdldCByZWZyZXNoIHRva2VuXG5cdFx0Y29uc3QgcmVmcmVzaFRva2VuOiBzdHJpbmcgPSB0aGlzLmFjY2Vzc1Rva2VuIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwgPyB0aGlzLmFjY2Vzc1Rva2VuLnJlZnJlc2hUb2tlbiA6ICcnO1xuXG5cdFx0Ly8gU2V0IHJvb3Qgc3RyYXRlZ3lcblx0XHR0aGlzLmFwaVNlcnZpY2UuY2hhbmdlQXBpUmVzcG9uc2VTdHJhdGVneSgncm9vdCcpO1xuXG5cdFx0Ly8gUmVxdWVzdCB0b2tlblxuXHRcdHJldHVybiB0aGlzLmFwaVNlcnZpY2UuY3JlYXRlT2JqKHRoaXMuY29uZmlnLm9hdXRoVXJpLCB7XG5cdFx0XHRyZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG5cdFx0XHRncmFudF90eXBlOiB0aGlzLmNvbmZpZy5ncmFudFR5cGVSZWZyZXNoLFxuXHRcdFx0Y2xpZW50X2lkOiB0aGlzLmNvbmZpZy5jbGllbnRJZFxuXHRcdH0pLnBpcGUoXG5cdFx0XHRtYXAoKHJlc3BvbnNlOiBBcGlSZXNwb25zZU1vZGVsKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHJlc3BvbnNlXG5cdFx0XHRcdGlmIChyZXNwb25zZS5kYXRhKSB7XG5cdFx0XHRcdFx0Ly8gTG9hZCB0aGUgcmVmcmVzaCB0b2tlblxuXHRcdFx0XHRcdHJlc3BvbnNlLmRhdGEucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hUb2tlbjtcblxuXHRcdFx0XHRcdC8vIFNhdmUgdG8gTFNcblx0XHRcdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldCh0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbkxzS2V5LCByZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENyZWF0ZXMgdGhlIGFjY2VzcyB0b2tlbiBtb2RlbFxuXHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gdGhpcy5wYXJzZUFjY2Vzc1Rva2VuKHJlc3BvbnNlLmRhdGEpO1xuXG5cdFx0XHRcdC8vIExvYWQgdG8gYXBpU2VydmljZSB0b1xuXHRcdFx0XHR0aGlzLmFwaVNlcnZpY2Uuc2V0QWNjZXNzVG9rZW4odGhpcy5hY2Nlc3NUb2tlbi50b2tlbik7XG5cblx0XHRcdFx0Ly8gUmVzdG9yZVxuXHRcdFx0XHR0aGlzLmFwaVNlcnZpY2UucmVzdG9yZUFwaVJlc3BvbnNlU3RyYXRlZ3koKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWNjZXNzVG9rZW47XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgbG9hZFNlc3Npb24oKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG5cdFx0Ly8gQ3JlYXRlIGFuIG9ic2VydmFibGVcblx0XHRjb25zdCBvYnMgPSBuZXcgT2JzZXJ2YWJsZTxib29sZWFuPigob2JzZXJ2ZXI6IGFueSkgPT4ge1xuXHRcdFx0Y29uc3QgYWNjZXNzVG9rZW5MczogYW55ID0gdGhpcy5zdG9yYWdlU2VydmljZS5nZXQodGhpcy5jb25maWcuYWNjZXNzVG9rZW5Mc0tleSk7XG5cdFx0XHRjb25zdCBsYXN0TWVBdmF0YXI6IHN0cmluZyA9IHRoaXMuc3RvcmFnZVNlcnZpY2UuZ2V0KHRoaXMuY29uZmlnLmxhc3RNZUF2YXRhckxzS2V5KTtcblx0XHRcdGNvbnN0IGxhc3RNZVVzZXJuYW1lOiBzdHJpbmcgPSB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmdldCh0aGlzLmNvbmZpZy5sYXN0TWVVc2VybmFtZUxzS2V5KTtcblx0XHRcdGNvbnN0IGNvbXBsZXRlT2JzZXJ2YWJsZTogRnVuY3Rpb24gPSAocmVzdWx0OiBib29sZWFuKSA9PiB7XG5cdFx0XHRcdG9ic2VydmVyLm5leHQocmVzdWx0KTtcblx0XHRcdFx0b2JzZXJ2ZXIuY29tcGxldGUoKTtcblx0XHRcdH07XG5cblx0XHRcdC8vIExvYWQgbGFzdCB1c2VyXG5cdFx0XHRpZiAobGFzdE1lVXNlcm5hbWUgfHwgbGFzdE1lVXNlcm5hbWUpIHtcblx0XHRcdFx0dGhpcy5sYXN0TWUgPSBuZXcgTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsKFxuXHRcdFx0XHRcdGxhc3RNZVVzZXJuYW1lLFxuXHRcdFx0XHRcdGxhc3RNZUF2YXRhclxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5sYXN0TWUgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDaGVjayBhY2Nlc3MgdG9rZW4gZ2V0dGVkIGZyb20gbHNcblx0XHRcdGlmIChhY2Nlc3NUb2tlbkxzKSB7XG5cdFx0XHRcdC8vIENyZWF0IGFjY2VzcyB0b2tlblxuXHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gdGhpcy5wYXJzZUFjY2Vzc1Rva2VuKGFjY2Vzc1Rva2VuTHMpO1xuXG5cdFx0XHRcdC8vIENoZWNrIHRva2VuXG5cdFx0XHRcdGlmICh0aGlzLmFjY2Vzc1Rva2VuIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwpIHtcblx0XHRcdFx0XHQvLyBIYXMgY29uZmlndXJlZCBtZVxuXHRcdFx0XHRcdGlmICh0aGlzLmNvbmZpZy5vYXV0aE1lVXJpKSB7XG5cdFx0XHRcdFx0XHQvLyBMb2FkIHRvIGFwaVNlcnZpY2UgdG9cblx0XHRcdFx0XHRcdHRoaXMuYXBpU2VydmljZS5zZXRBY2Nlc3NUb2tlbih0aGlzLmFjY2Vzc1Rva2VuLnRva2VuKTtcblxuXHRcdFx0XHRcdFx0Ly8gUmVxdWVzdCBtZSBpbmZvXG5cdFx0XHRcdFx0XHR0aGlzLnJlcXVlc3RNZSgpLnN1YnNjcmliZShcblx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdC8vIE5vdGlmeSB1c2VyIHN0YXRlXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5jaGVja0FuZE5vdGlmeU1lU3RhdGUoKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEZpbmlzaCBsb2FkXG5cdFx0XHRcdFx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKHRydWUpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmluaXNoIGxvYWRcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBMb2FkIHN1Y2Nlc3Mgd2l0aG91dCBtZVxuXHRcdFx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBGaW5pc2ggbG9hZFxuXHRcdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZShmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEZpbmlzaCBsb2FkXG5cdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZShmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG9icztcblx0fVxuXG5cdHB1YmxpYyBsb2dvdXQoKTogdm9pZCB7XG5cdFx0Ly8gQ2xlYXIgTG9jYWwgc3RvcmFnZVxuXHRcdHRoaXMuc3RvcmFnZVNlcnZpY2UucmVtb3ZlKHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuTHNLZXkpO1xuXG5cdFx0Ly8gQ2xlYXIgZGF0YSBpbiBtZW1vcnlcblx0XHR0aGlzLm1lID0gbnVsbDtcblx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcblxuXHRcdC8vIEVtaXQgc3RhdGUgY2hhbmdlXG5cdFx0dGhpcy5jaGVja0FuZE5vdGlmeU1lU3RhdGUoKTtcblx0fVxuXG5cdHB1YmxpYyBjaGVja0FuZE5vdGlmeU1lU3RhdGUoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubWUgaW5zdGFuY2VvZiBOZ3hHdXN0YXZndWV6TWVNb2RlbCAmJiB0aGlzLmFjY2Vzc1Rva2VuIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwpIHtcblx0XHRcdC8vIEVtaXQgbG9naW4gZXZlbnRcblx0XHRcdHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2UuZW1pdCh0cnVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRW1pdCBsb2dpbiBldmVudFxuXHRcdFx0dGhpcy5vblNlc3Npb25TdGF0ZUNoYW5nZS5lbWl0KGZhbHNlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlTWUobWU6IE5neEd1c3Rhdmd1ZXpNZU1vZGVsKTogdm9pZCB7XG5cdFx0dGhpcy5tZSA9IG1lO1xuXG5cdFx0Ly8gRW1pdCBjaGFuZ2Vcblx0XHR0aGlzLm9uTWVDaGFuZ2VkLmVtaXQobWUpO1xuXHR9XG5cblx0Ly8gUHJpdmF0ZSBtZXRob2RzXG5cdHByaXZhdGUgcGFyc2VBY2Nlc3NUb2tlbihqc29uOiBhbnkpOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCB7XG5cdFx0bGV0IGFjY2Vzc1Rva2VuOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCA9IG51bGw7XG5cblx0XHQvLyBDaGVjayBhY2Nlc3MgdG9rZW5cblx0XHRpZiAoanNvbiAmJiBqc29uLmFjY2Vzc190b2tlbikge1xuXHRcdFx0Ly8gcGFyc2UgZXhwaXJhdGlvbiBkYXRlXG5cdFx0XHRjb25zdCBleHBpcmF0aW9uOiBEYXRlID0gbmV3IERhdGUoKTtcblx0XHRcdGNvbnN0IGV4cGlyZXNJbjogbnVtYmVyID0ganNvbi5leHBpcmVzX2luIC8gNjA7XG5cdFx0XHRleHBpcmF0aW9uLnNldE1pbnV0ZXMoZXhwaXJhdGlvbi5nZXRNaW51dGVzKCkgKyBleHBpcmVzSW4pO1xuXG5cdFx0XHQvLyBDcmVhdGVzIHRoZSBhY2Nlc3MgdG9rZW4gbW9kZWxcblx0XHRcdGFjY2Vzc1Rva2VuID0gbmV3IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKFxuXHRcdFx0XHRqc29uLmFjY2Vzc190b2tlbixcblx0XHRcdFx0anNvbi5yZWZyZXNoX3Rva2VuLFxuXHRcdFx0XHRleHBpcmF0aW9uXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYWNjZXNzVG9rZW47XG5cdH1cbn1cbiJdfQ==