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
                return _this.parseAccessToken(response);
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
                        // Load response
                        observer.next(true);
                        observer.complete();
                    }, function () {
                        // Rise error
                        observer.error(response);
                    });
                }
                else {
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
        return this.apiService.fetchData(this.config.oauthMeUri).pipe(map(function (response) {
            // Load userLogged
            _this.me = new NgxGustavguezMeModel();
            _this.me.fromJSON(response.data.me);
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
            return _this.me;
        }));
    };
    NgxGustavguezAuthService.prototype.refreshToken = function () {
        var _this = this;
        // Get refresh token
        var refreshToken = this.accessToken instanceof NgxGustavguezAccessTokenModel ? this.accessToken.refreshToken : '';
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
            _this.accessToken = _this.parseAccessToken(response);
            // Load to apiService to
            _this.apiService.setAccessToken(_this.accessToken.token);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1c3Rhdmd1ZXotYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQU1qRTtJQWFDLHVCQUF1QjtJQUN2QixrQ0FDUyxjQUFtQyxFQUNuQyxVQUFzQjtRQUR0QixtQkFBYyxHQUFkLGNBQWMsQ0FBcUI7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUM5Qix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFMUMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFD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bUI7WUFDbkIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QztJQUNGLENBQUM7SUFFTSwyQ0FBUSxHQUFmLFVBQWdCLEVBQXdCO1FBQ3ZDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRWIsY0FBYztRQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxrQkFBa0I7SUFDVixtREFBZ0IsR0FBeEIsVUFBeUIsSUFBUztRQUNqQyxJQUFJLFdBQVcsR0FBa0MsSUFBSSxDQUFDO1FBRXRELHFCQUFxQjtRQUNyQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQzlCLHdCQUF3QjtZQUN4QixJQUFNLFVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3BDLElBQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBQy9DLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBRTNELGlDQUFpQztZQUNqQyxXQUFXLEdBQUcsSUFBSSw2QkFBNkIsQ0FDOUMsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsVUFBVSxDQUNWLENBQUM7U0FDRjtRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3BCLENBQUM7O2dCQTFRd0IsbUJBQW1CO2dCQUN2QixVQUFVOzs7SUFoQm5CLHdCQUF3QjtRQUhwQyxVQUFVLENBQUM7WUFDWCxVQUFVLEVBQUUsTUFBTTtTQUNsQixDQUFDO09BQ1csd0JBQXdCLENBMFJwQzttQ0F6U0Q7Q0F5U0MsQUExUkQsSUEwUkM7U0ExUlksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnYW5ndWxhci0yLWxvY2FsLXN0b3JhZ2UnO1xuaW1wb3J0IHsgQXBpU2VydmljZSwgQXBpUmVzcG9uc2VNb2RlbCB9IGZyb20gJ25neC1ndXN0YXZndWV6LWNvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6Q29uZmlnTW9kZWwgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotYWNjZXNzLXRva2VuLm1vZGVsJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotbGFzdC1tZS5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6TWVNb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotbWUubW9kZWwnO1xuaW1wb3J0IHsgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbkBJbmplY3RhYmxlKHtcblx0cHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2Uge1xuXG5cdC8vIE1vZGVsc1xuXHRwcml2YXRlIG1lOiBOZ3hHdXN0YXZndWV6TWVNb2RlbDtcblx0cHJpdmF0ZSBjb25maWc6IE5neEd1c3Rhdmd1ZXpDb25maWdNb2RlbDtcblx0cHJpdmF0ZSBsYXN0TWU6IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbDtcblx0cHJpdmF0ZSBhY2Nlc3NUb2tlbjogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWw7XG5cblx0Ly8gVXNlciBzZXNzaW9uIGV2ZW50cyBlbWl0dGVyc1xuXHRwcml2YXRlIG9uU2Vzc2lvblN0YXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XG5cdHByaXZhdGUgb25NZVBhcnNlZDogRXZlbnRFbWl0dGVyPGFueT47XG5cdHByaXZhdGUgb25NZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxOZ3hHdXN0YXZndWV6TWVNb2RlbD47XG5cblx0Ly8gU2VydmljZSBjb25zdHJ1Y3R1cmVcblx0Y29uc3RydWN0b3IoXG5cdFx0cHJpdmF0ZSBzdG9yYWdlU2VydmljZTogTG9jYWxTdG9yYWdlU2VydmljZSxcblx0XHRwcml2YXRlIGFwaVNlcnZpY2U6IEFwaVNlcnZpY2UpIHtcblx0XHQvLyBDcmVhdGUgZXZlbnQgZW1pdHRlcnNcblx0XHR0aGlzLm9uU2Vzc2lvblN0YXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXHRcdHRoaXMub25NZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPigpO1xuXHRcdHRoaXMub25NZVBhcnNlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG5cdFx0Ly8gRGVmYXVsdCB2YWx1ZXNcblx0XHR0aGlzLmNvbmZpZyA9IG5ldyBOZ3hHdXN0YXZndWV6Q29uZmlnTW9kZWwoKTtcblx0fVxuXG5cdC8vIE1ldGhvZHNcblx0cHVibGljIHNldENvbmZpZyhjb25maWc6IE5neEd1c3Rhdmd1ZXpDb25maWdNb2RlbCk6IHZvaWQge1xuXHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHR9XG5cblx0cHVibGljIGdldExhc3RNZSgpOiBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwge1xuXHRcdHJldHVybiB0aGlzLmxhc3RNZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRBY2Nlc3NUb2tlbigpOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMuYWNjZXNzVG9rZW47XG5cdH1cblxuXHRwdWJsaWMgZ2V0TWUoKTogTmd4R3VzdGF2Z3Vlek1lTW9kZWwge1xuXHRcdHJldHVybiB0aGlzLm1lO1xuXHR9XG5cblx0cHVibGljIGlzTG9nZ2VkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhIXRoaXMubWU7XG5cdH1cblxuXHRwdWJsaWMgZ2V0T25TZXNzaW9uU3RhdGVDaGFuZ2UoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG5cdFx0cmV0dXJuIHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2U7XG5cdH1cblxuXHRwdWJsaWMgZ2V0T25NZUNoYW5nZWQoKTogT2JzZXJ2YWJsZTxOZ3hHdXN0YXZndWV6TWVNb2RlbD4ge1xuXHRcdHJldHVybiB0aGlzLm9uTWVDaGFuZ2VkO1xuXHR9XG5cblx0cHVibGljIGdldE9uTWVQYXJzZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRyZXR1cm4gdGhpcy5vbk1lUGFyc2VkO1xuXHR9XG5cblx0Ly8gR2VuZXJhdGUgYSBhY2Nlc3MgdG9rZW5cblx0cHVibGljIGxvZ2luKGxvZ2luVXNlcm5hbWU6IHN0cmluZywgbG9naW5QYXNzd29yZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG5cdFx0Ly8gQ3JlYXRlIGFuIG9ic2VydmFibGVcblx0XHRjb25zdCBvYnMgPSBuZXcgT2JzZXJ2YWJsZTxib29sZWFuPigob2JzZXJ2ZXI6IGFueSkgPT4ge1xuXHRcdFx0Ly8gUmVxdWVzdCB0b2tlblxuXHRcdFx0dGhpcy5hcGlTZXJ2aWNlLmNyZWF0ZU9iaih0aGlzLmNvbmZpZy5vYXV0aFVyaSwge1xuXHRcdFx0XHR1c2VybmFtZTogbG9naW5Vc2VybmFtZSxcblx0XHRcdFx0cGFzc3dvcmQ6IGxvZ2luUGFzc3dvcmQsXG5cdFx0XHRcdGdyYW50X3R5cGU6IHRoaXMuY29uZmlnLmdyYW50VHlwZSxcblx0XHRcdFx0Y2xpZW50X2lkOiB0aGlzLmNvbmZpZy5jbGllbnRJZCxcblx0XHRcdFx0Y2xpZW50X3NlY3JldDogdGhpcy5jb25maWcuY2xpZW50U2VjcmV0XG5cdFx0XHR9KS5waXBlKFxuXHRcdFx0XHRtYXAoKHJlc3BvbnNlOiBBcGlSZXNwb25zZU1vZGVsKSA9PiB7XG5cdFx0XHRcdFx0Ly8gU2F2ZSB0b2tlbiB0byBMb2NhbCBzdG9yYWdlXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0KHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuTHNLZXksIHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIENyZWF0ZXMgdGhlIGFjY2VzcyB0b2tlbiBtb2RlbFxuXHRcdFx0XHRcdHJldHVybiB0aGlzLnBhcnNlQWNjZXNzVG9rZW4ocmVzcG9uc2UpO1xuXHRcdFx0XHR9KVxuXHRcdFx0KS5zdWJzY3JpYmUoKHJlc3BvbnNlOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCkgPT4ge1xuXHRcdFx0XHQvLyBMb2FkIGFjY2Vzc3Rva2VuXG5cdFx0XHRcdHRoaXMuYWNjZXNzVG9rZW4gPSByZXNwb25zZTtcblxuXHRcdFx0XHQvLyBMb2FkIHRvIGFwaVNlcnZpY2UgdG9cblx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnNldEFjY2Vzc1Rva2VuKHRoaXMuYWNjZXNzVG9rZW4udG9rZW4pO1xuXG5cdFx0XHRcdC8vIENoZWNrIG1lVXJsXG5cdFx0XHRcdGlmICh0aGlzLmNvbmZpZy5vYXV0aE1lVXJpKSB7XG5cdFx0XHRcdFx0Ly8gUmVxdWVzdCBtZSBpbmZvXG5cdFx0XHRcdFx0dGhpcy5yZXF1ZXN0TWUoKS5zdWJzY3JpYmUoXG5cdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdC8vIE5vdGlmeSB1c2VyIHN0YXRlXG5cdFx0XHRcdFx0XHRcdHRoaXMuY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gTG9hZCByZXNwb25zZVxuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5uZXh0KHRydWUpO1xuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5jb21wbGV0ZSgpO1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0Ly8gUmlzZSBlcnJvclxuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5lcnJvcihyZXNwb25zZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBDb21wbGV0ZSBzdWJzY3JpYmVcblx0XHRcdFx0XHRvYnNlcnZlci5uZXh0KHRydWUpO1xuXHRcdFx0XHRcdG9ic2VydmVyLmNvbXBsZXRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIChyZXNwb25zZTogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcblx0XHRcdFx0Ly8gUmlzZSBlcnJvclxuXHRcdFx0XHRvYnNlcnZlci5lcnJvcihyZXNwb25zZSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gb2JzO1xuXHR9XG5cblx0Ly8gR2VuZXJhdGUgYSBhY2Nlc3MgdG9rZW5cblx0cHVibGljIHJlcXVlc3RNZSgpOiBPYnNlcnZhYmxlPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPiB7XG5cdFx0cmV0dXJuIHRoaXMuYXBpU2VydmljZS5mZXRjaERhdGEodGhpcy5jb25maWcub2F1dGhNZVVyaSkucGlwZShcblx0XHRcdG1hcCgocmVzcG9uc2U6IEFwaVJlc3BvbnNlTW9kZWwpID0+IHtcblx0XHRcdFx0Ly8gTG9hZCB1c2VyTG9nZ2VkXG5cdFx0XHRcdHRoaXMubWUgPSBuZXcgTmd4R3VzdGF2Z3Vlek1lTW9kZWwoKTtcblx0XHRcdFx0dGhpcy5tZS5mcm9tSlNPTihyZXNwb25zZS5kYXRhLm1lKTtcblxuXHRcdFx0XHQvLyBFbWl0IHBhcnNlZCBhbmQgY2hhbmdlZFxuXHRcdFx0XHR0aGlzLm9uTWVQYXJzZWQuZW1pdChyZXNwb25zZS5kYXRhKTtcblx0XHRcdFx0dGhpcy5vbk1lQ2hhbmdlZC5lbWl0KHRoaXMubWUpO1xuXG5cdFx0XHRcdC8vIExvYWQgdXNlciBsb2dnZWRcblx0XHRcdFx0dGhpcy5sYXN0TWUgPSBuZXcgTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsKCk7XG5cdFx0XHRcdHRoaXMubGFzdE1lLmF2YXRhciA9IHRoaXMubWUucHJvZmlsZUltYWdlO1xuXHRcdFx0XHR0aGlzLmxhc3RNZS51c2VybmFtZSA9IHRoaXMubWUudXNlcm5hbWU7XG5cblx0XHRcdFx0Ly8gU2F2ZSB0byBMU1xuXHRcdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldCh0aGlzLmNvbmZpZy5sYXN0TWVBdmF0YXJMc0tleSwgdGhpcy5tZS5wcm9maWxlSW1hZ2UpO1xuXHRcdFx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldCh0aGlzLmNvbmZpZy5sYXN0TWVVc2VybmFtZUxzS2V5LCB0aGlzLm1lLnVzZXJuYW1lKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMubWU7XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH1cblxuXHRwdWJsaWMgcmVmcmVzaFRva2VuKCk6IE9ic2VydmFibGU8Tmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWw+IHtcblx0XHQvLyBHZXQgcmVmcmVzaCB0b2tlblxuXHRcdGNvbnN0IHJlZnJlc2hUb2tlbjogc3RyaW5nID0gdGhpcy5hY2Nlc3NUb2tlbiBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsID8gdGhpcy5hY2Nlc3NUb2tlbi5yZWZyZXNoVG9rZW4gOiAnJztcblxuXHRcdC8vIFJlcXVlc3QgdG9rZW5cblx0XHRyZXR1cm4gdGhpcy5hcGlTZXJ2aWNlLmNyZWF0ZU9iaih0aGlzLmNvbmZpZy5vYXV0aFVyaSwge1xuXHRcdFx0cmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuXHRcdFx0Z3JhbnRfdHlwZTogdGhpcy5jb25maWcuZ3JhbnRUeXBlUmVmcmVzaCxcblx0XHRcdGNsaWVudF9pZDogdGhpcy5jb25maWcuY2xpZW50SWRcblx0XHR9KS5waXBlKFxuXHRcdFx0bWFwKChyZXNwb25zZTogQXBpUmVzcG9uc2VNb2RlbCkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayByZXNwb25zZVxuXHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YSkge1xuXHRcdFx0XHRcdC8vIExvYWQgdGhlIHJlZnJlc2ggdG9rZW5cblx0XHRcdFx0XHRyZXNwb25zZS5kYXRhLnJlZnJlc2hfdG9rZW4gPSByZWZyZXNoVG9rZW47XG5cblx0XHRcdFx0XHQvLyBTYXZlIHRvIExTXG5cdFx0XHRcdFx0dGhpcy5zdG9yYWdlU2VydmljZS5zZXQodGhpcy5jb25maWcuYWNjZXNzVG9rZW5Mc0tleSwgcmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDcmVhdGVzIHRoZSBhY2Nlc3MgdG9rZW4gbW9kZWxcblx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMucGFyc2VBY2Nlc3NUb2tlbihyZXNwb25zZSk7XG5cblx0XHRcdFx0Ly8gTG9hZCB0byBhcGlTZXJ2aWNlIHRvXG5cdFx0XHRcdHRoaXMuYXBpU2VydmljZS5zZXRBY2Nlc3NUb2tlbih0aGlzLmFjY2Vzc1Rva2VuLnRva2VuKTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbjtcblx0XHRcdH0pXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyBsb2FkU2Vzc2lvbigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHQvLyBDcmVhdGUgYW4gb2JzZXJ2YWJsZVxuXHRcdGNvbnN0IG9icyA9IG5ldyBPYnNlcnZhYmxlPGJvb2xlYW4+KChvYnNlcnZlcjogYW55KSA9PiB7XG5cdFx0XHRjb25zdCBhY2Nlc3NUb2tlbkxzOiBhbnkgPSB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmdldCh0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbkxzS2V5KTtcblx0XHRcdGNvbnN0IGxhc3RNZUF2YXRhcjogc3RyaW5nID0gdGhpcy5zdG9yYWdlU2VydmljZS5nZXQodGhpcy5jb25maWcubGFzdE1lQXZhdGFyTHNLZXkpO1xuXHRcdFx0Y29uc3QgbGFzdE1lVXNlcm5hbWU6IHN0cmluZyA9IHRoaXMuc3RvcmFnZVNlcnZpY2UuZ2V0KHRoaXMuY29uZmlnLmxhc3RNZVVzZXJuYW1lTHNLZXkpO1xuXHRcdFx0Y29uc3QgY29tcGxldGVPYnNlcnZhYmxlOiBGdW5jdGlvbiA9IChyZXN1bHQ6IGJvb2xlYW4pID0+IHtcblx0XHRcdFx0b2JzZXJ2ZXIubmV4dChyZXN1bHQpO1xuXHRcdFx0XHRvYnNlcnZlci5jb21wbGV0ZSgpO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gTG9hZCBsYXN0IHVzZXJcblx0XHRcdGlmIChsYXN0TWVVc2VybmFtZSB8fCBsYXN0TWVVc2VybmFtZSkge1xuXHRcdFx0XHR0aGlzLmxhc3RNZSA9IG5ldyBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwoXG5cdFx0XHRcdFx0bGFzdE1lVXNlcm5hbWUsXG5cdFx0XHRcdFx0bGFzdE1lQXZhdGFyXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxhc3RNZSA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoZWNrIGFjY2VzcyB0b2tlbiBnZXR0ZWQgZnJvbSBsc1xuXHRcdFx0aWYgKGFjY2Vzc1Rva2VuTHMpIHtcblx0XHRcdFx0Ly8gQ3JlYXQgYWNjZXNzIHRva2VuXG5cdFx0XHRcdHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLnBhcnNlQWNjZXNzVG9rZW4oYWNjZXNzVG9rZW5Mcyk7XG5cblx0XHRcdFx0Ly8gQ2hlY2sgdG9rZW5cblx0XHRcdFx0aWYgKHRoaXMuYWNjZXNzVG9rZW4gaW5zdGFuY2VvZiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCkge1xuXHRcdFx0XHRcdC8vIEhhcyBjb25maWd1cmVkIG1lXG5cdFx0XHRcdFx0aWYgKHRoaXMuY29uZmlnLm9hdXRoTWVVcmkpIHtcblx0XHRcdFx0XHRcdC8vIFJlcXVlc3QgbWUgaW5mb1xuXHRcdFx0XHRcdFx0dGhpcy5yZXF1ZXN0TWUoKS5zdWJzY3JpYmUoXG5cdFx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHQvLyBOb3RpZnkgdXNlciBzdGF0ZVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBGaW5pc2ggbG9hZFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZSh0cnVlKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdC8vIEZpbmlzaCBsb2FkXG5cdFx0XHRcdFx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gTG9hZCBzdWNjZXNzIHdpdGhvdXQgbWVcblx0XHRcdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZSh0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRmluaXNoIGxvYWRcblx0XHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBGaW5pc2ggbG9hZFxuXHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvYnM7XG5cdH1cblxuXHRwdWJsaWMgbG9nb3V0KCk6IHZvaWQge1xuXHRcdC8vIENsZWFyIExvY2FsIHN0b3JhZ2Vcblx0XHR0aGlzLnN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSh0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbkxzS2V5KTtcblxuXHRcdC8vIENsZWFyIGRhdGEgaW4gbWVtb3J5XG5cdFx0dGhpcy5tZSA9IG51bGw7XG5cdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG5cblx0XHQvLyBFbWl0IHN0YXRlIGNoYW5nZVxuXHRcdHRoaXMuY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk7XG5cdH1cblxuXHRwdWJsaWMgY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLm1lIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3Vlek1lTW9kZWwgJiYgdGhpcy5hY2Nlc3NUb2tlbiBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKSB7XG5cdFx0XHQvLyBFbWl0IGxvZ2luIGV2ZW50XG5cdFx0XHR0aGlzLm9uU2Vzc2lvblN0YXRlQ2hhbmdlLmVtaXQodHJ1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEVtaXQgbG9naW4gZXZlbnRcblx0XHRcdHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2UuZW1pdChmYWxzZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZU1lKG1lOiBOZ3hHdXN0YXZndWV6TWVNb2RlbCk6IHZvaWQge1xuXHRcdHRoaXMubWUgPSBtZTtcblxuXHRcdC8vIEVtaXQgY2hhbmdlXG5cdFx0dGhpcy5vbk1lQ2hhbmdlZC5lbWl0KG1lKTtcblx0fVxuXG5cdC8vIFByaXZhdGUgbWV0aG9kc1xuXHRwcml2YXRlIHBhcnNlQWNjZXNzVG9rZW4oanNvbjogYW55KTogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwge1xuXHRcdGxldCBhY2Nlc3NUb2tlbjogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwgPSBudWxsO1xuXG5cdFx0Ly8gQ2hlY2sgYWNjZXNzIHRva2VuXG5cdFx0aWYgKGpzb24gJiYganNvbi5hY2Nlc3NfdG9rZW4pIHtcblx0XHRcdC8vIHBhcnNlIGV4cGlyYXRpb24gZGF0ZVxuXHRcdFx0Y29uc3QgZXhwaXJhdGlvbjogRGF0ZSA9IG5ldyBEYXRlKCk7XG5cdFx0XHRjb25zdCBleHBpcmVzSW46IG51bWJlciA9IGpzb24uZXhwaXJlc19pbiAvIDYwO1xuXHRcdFx0ZXhwaXJhdGlvbi5zZXRNaW51dGVzKGV4cGlyYXRpb24uZ2V0TWludXRlcygpICsgZXhwaXJlc0luKTtcblxuXHRcdFx0Ly8gQ3JlYXRlcyB0aGUgYWNjZXNzIHRva2VuIG1vZGVsXG5cdFx0XHRhY2Nlc3NUb2tlbiA9IG5ldyBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbChcblx0XHRcdFx0anNvbi5hY2Nlc3NfdG9rZW4sXG5cdFx0XHRcdGpzb24ucmVmcmVzaF90b2tlbixcblx0XHRcdFx0ZXhwaXJhdGlvblxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFjY2Vzc1Rva2VuO1xuXHR9XG59XG4iXX0=