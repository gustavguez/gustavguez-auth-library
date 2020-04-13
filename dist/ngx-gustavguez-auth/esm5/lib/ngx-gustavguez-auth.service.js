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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1c3Rhdmd1ZXotYXV0aC8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQU1qRTtJQWFDLHVCQUF1QjtJQUN2QixrQ0FDUyxjQUFtQyxFQUNuQyxVQUFzQjtRQUR0QixtQkFBYyxHQUFkLGNBQWMsQ0FBcUI7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUM5Qix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUM1RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFMUMsaUJBQWlCO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFD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QUksSUFBSSxFQUFFLENBQUM7WUFDcEMsSUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDL0MsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7WUFFM0QsaUNBQWlDO1lBQ2pDLFdBQVcsR0FBRyxJQUFJLDZCQUE2QixDQUM5QyxJQUFJLENBQUMsWUFBWSxFQUNqQixJQUFJLENBQUMsYUFBYSxFQUNsQixVQUFVLENBQ1YsQ0FBQztTQUNGO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDcEIsQ0FBQzs7Z0JBbFN3QixtQkFBbUI7Z0JBQ3ZCLFVBQVU7OztJQWhCbkIsd0JBQXdCO1FBSHBDLFVBQVUsQ0FBQztZQUNYLFVBQVUsRUFBRSxNQUFNO1NBQ2xCLENBQUM7T0FDVyx3QkFBd0IsQ0FrVHBDO21DQWpVRDtDQWlVQyxBQWxURCxJQWtUQztTQWxUWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICdhbmd1bGFyLTItbG9jYWwtc3RvcmFnZSc7XG5pbXBvcnQgeyBBcGlTZXJ2aWNlLCBBcGlSZXNwb25zZU1vZGVsIH0gZnJvbSAnbmd4LWd1c3Rhdmd1ZXotY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpDb25maWdNb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotY29uZmlnLm1vZGVsJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1hY2Nlc3MtdG9rZW4ubW9kZWwnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1sYXN0LW1lLm1vZGVsJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpNZU1vZGVsIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1tZS5tb2RlbCc7XG5pbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuQEluamVjdGFibGUoe1xuXHRwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIE5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZSB7XG5cblx0Ly8gTW9kZWxzXG5cdHByaXZhdGUgbWU6IE5neEd1c3Rhdmd1ZXpNZU1vZGVsO1xuXHRwcml2YXRlIGNvbmZpZzogTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsO1xuXHRwcml2YXRlIGxhc3RNZTogTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsO1xuXHRwcml2YXRlIGFjY2Vzc1Rva2VuOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbDtcblxuXHQvLyBVc2VyIHNlc3Npb24gZXZlbnRzIGVtaXR0ZXJzXG5cdHByaXZhdGUgb25TZXNzaW9uU3RhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcblx0cHJpdmF0ZSBvbk1lUGFyc2VkOiBFdmVudEVtaXR0ZXI8YW55Pjtcblx0cHJpdmF0ZSBvbk1lQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPjtcblxuXHQvLyBTZXJ2aWNlIGNvbnN0cnVjdHVyZVxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHN0b3JhZ2VTZXJ2aWNlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlLFxuXHRcdHByaXZhdGUgYXBpU2VydmljZTogQXBpU2VydmljZSkge1xuXHRcdC8vIENyZWF0ZSBldmVudCBlbWl0dGVyc1xuXHRcdHRoaXMub25TZXNzaW9uU3RhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cdFx0dGhpcy5vbk1lQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Tmd4R3VzdGF2Z3Vlek1lTW9kZWw+KCk7XG5cdFx0dGhpcy5vbk1lUGFyc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cblx0XHQvLyBEZWZhdWx0IHZhbHVlc1xuXHRcdHRoaXMuY29uZmlnID0gbmV3IE5neEd1c3Rhdmd1ZXpDb25maWdNb2RlbCgpO1xuXHR9XG5cblx0Ly8gTWV0aG9kc1xuXHRwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogTmd4R3VzdGF2Z3VlekNvbmZpZ01vZGVsKTogdm9pZCB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdH1cblxuXHRwdWJsaWMgZ2V0TGFzdE1lKCk6IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMubGFzdE1lO1xuXHR9XG5cblx0cHVibGljIGdldEFjY2Vzc1Rva2VuKCk6IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsIHtcblx0XHRyZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbjtcblx0fVxuXG5cdHB1YmxpYyBnZXRNZSgpOiBOZ3hHdXN0YXZndWV6TWVNb2RlbCB7XG5cdFx0cmV0dXJuIHRoaXMubWU7XG5cdH1cblxuXHRwdWJsaWMgaXNMb2dnZWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuICEhdGhpcy5tZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRPblNlc3Npb25TdGF0ZUNoYW5nZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHRyZXR1cm4gdGhpcy5vblNlc3Npb25TdGF0ZUNoYW5nZTtcblx0fVxuXG5cdHB1YmxpYyBnZXRPbk1lQ2hhbmdlZCgpOiBPYnNlcnZhYmxlPE5neEd1c3Rhdmd1ZXpNZU1vZGVsPiB7XG5cdFx0cmV0dXJuIHRoaXMub25NZUNoYW5nZWQ7XG5cdH1cblxuXHRwdWJsaWMgZ2V0T25NZVBhcnNlZCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuXHRcdHJldHVybiB0aGlzLm9uTWVQYXJzZWQ7XG5cdH1cblxuXHQvLyBHZW5lcmF0ZSBhIGFjY2VzcyB0b2tlblxuXHRwdWJsaWMgbG9naW4obG9naW5Vc2VybmFtZTogc3RyaW5nLCBsb2dpblBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHQvLyBDcmVhdGUgYW4gb2JzZXJ2YWJsZVxuXHRcdGNvbnN0IG9icyA9IG5ldyBPYnNlcnZhYmxlPGJvb2xlYW4+KChvYnNlcnZlcjogYW55KSA9PiB7XG5cdFx0XHQvLyBTZXQgcm9vdCBzdHJhdGVneVxuXHRcdFx0dGhpcy5hcGlTZXJ2aWNlLmNoYW5nZUFwaVJlc3BvbnNlU3RyYXRlZ3koJ3Jvb3QnKTtcblxuXHRcdFx0Ly8gUmVxdWVzdCB0b2tlblxuXHRcdFx0dGhpcy5hcGlTZXJ2aWNlLmNyZWF0ZU9iaih0aGlzLmNvbmZpZy5vYXV0aFVyaSwge1xuXHRcdFx0XHR1c2VybmFtZTogbG9naW5Vc2VybmFtZSxcblx0XHRcdFx0cGFzc3dvcmQ6IGxvZ2luUGFzc3dvcmQsXG5cdFx0XHRcdGdyYW50X3R5cGU6IHRoaXMuY29uZmlnLmdyYW50VHlwZSxcblx0XHRcdFx0Y2xpZW50X2lkOiB0aGlzLmNvbmZpZy5jbGllbnRJZCxcblx0XHRcdFx0Y2xpZW50X3NlY3JldDogdGhpcy5jb25maWcuY2xpZW50U2VjcmV0XG5cdFx0XHR9KS5waXBlKFxuXHRcdFx0XHRtYXAoKHJlc3BvbnNlOiBBcGlSZXNwb25zZU1vZGVsKSA9PiB7XG5cdFx0XHRcdFx0Ly8gU2F2ZSB0b2tlbiB0byBMb2NhbCBzdG9yYWdlXG5cdFx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEpIHtcblx0XHRcdFx0XHRcdHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0KHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuTHNLZXksIHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIENyZWF0ZXMgdGhlIGFjY2VzcyB0b2tlbiBtb2RlbFxuXHRcdFx0XHRcdHJldHVybiB0aGlzLnBhcnNlQWNjZXNzVG9rZW4ocmVzcG9uc2UuZGF0YSk7XG5cdFx0XHRcdH0pXG5cdFx0XHQpLnN1YnNjcmliZSgocmVzcG9uc2U6IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKSA9PiB7XG5cdFx0XHRcdC8vIExvYWQgYWNjZXNzdG9rZW5cblx0XHRcdFx0dGhpcy5hY2Nlc3NUb2tlbiA9IHJlc3BvbnNlO1xuXG5cdFx0XHRcdC8vIExvYWQgdG8gYXBpU2VydmljZSB0b1xuXHRcdFx0XHR0aGlzLmFwaVNlcnZpY2Uuc2V0QWNjZXNzVG9rZW4odGhpcy5hY2Nlc3NUb2tlbi50b2tlbik7XG5cblx0XHRcdFx0Ly8gQ2hlY2sgbWVVcmxcblx0XHRcdFx0aWYgKHRoaXMuY29uZmlnLm9hdXRoTWVVcmkpIHtcblx0XHRcdFx0XHQvLyBSZXF1ZXN0IG1lIGluZm9cblx0XHRcdFx0XHR0aGlzLnJlcXVlc3RNZSgpLnN1YnNjcmliZShcblx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0Ly8gTm90aWZ5IHVzZXIgc3RhdGVcblx0XHRcdFx0XHRcdFx0dGhpcy5jaGVja0FuZE5vdGlmeU1lU3RhdGUoKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXN0b3JlXG5cdFx0XHRcdFx0XHRcdHRoaXMuYXBpU2VydmljZS5yZXN0b3JlQXBpUmVzcG9uc2VTdHJhdGVneSgpO1xuXG5cdFx0XHRcdFx0XHRcdC8vIExvYWQgcmVzcG9uc2Vcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIubmV4dCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIuY29tcGxldGUoKTtcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdC8vIFJpc2UgZXJyb3Jcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIuZXJyb3IocmVzcG9uc2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gUmVzdG9yZVxuXHRcdFx0XHRcdHRoaXMuYXBpU2VydmljZS5yZXN0b3JlQXBpUmVzcG9uc2VTdHJhdGVneSgpO1xuXG5cdFx0XHRcdFx0Ly8gQ29tcGxldGUgc3Vic2NyaWJlXG5cdFx0XHRcdFx0b2JzZXJ2ZXIubmV4dCh0cnVlKTtcblx0XHRcdFx0XHRvYnNlcnZlci5jb21wbGV0ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCAocmVzcG9uc2U6IEh0dHBFcnJvclJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdC8vIFJpc2UgZXJyb3Jcblx0XHRcdFx0b2JzZXJ2ZXIuZXJyb3IocmVzcG9uc2UpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG9icztcblx0fVxuXG5cdC8vIEdlbmVyYXRlIGEgYWNjZXNzIHRva2VuXG5cdHB1YmxpYyByZXF1ZXN0TWUoKTogT2JzZXJ2YWJsZTxOZ3hHdXN0YXZndWV6TWVNb2RlbD4ge1xuXHRcdC8vIFNldCByb290IHN0cmF0ZWd5XG5cdFx0dGhpcy5hcGlTZXJ2aWNlLmNoYW5nZUFwaVJlc3BvbnNlU3RyYXRlZ3koJ2RhdGEnKTtcblxuXHRcdC8vIERvIHJlcXVlc3Rcblx0XHRyZXR1cm4gdGhpcy5hcGlTZXJ2aWNlLmZldGNoRGF0YSh0aGlzLmNvbmZpZy5vYXV0aE1lVXJpKS5waXBlKFxuXHRcdFx0bWFwKChyZXNwb25zZTogQXBpUmVzcG9uc2VNb2RlbCkgPT4ge1xuXHRcdFx0XHQvLyBMb2FkIHVzZXJMb2dnZWRcblx0XHRcdFx0dGhpcy5tZSA9IG5ldyBOZ3hHdXN0YXZndWV6TWVNb2RlbCgpO1xuXHRcdFx0XHR0aGlzLm1lLmZyb21KU09OKHJlc3BvbnNlLmRhdGEubWUpO1xuXG5cdFx0XHRcdC8vIEVtaXQgcGFyc2VkIGFuZCBjaGFuZ2VkXG5cdFx0XHRcdHRoaXMub25NZVBhcnNlZC5lbWl0KHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0XHR0aGlzLm9uTWVDaGFuZ2VkLmVtaXQodGhpcy5tZSk7XG5cblx0XHRcdFx0Ly8gTG9hZCB1c2VyIGxvZ2dlZFxuXHRcdFx0XHR0aGlzLmxhc3RNZSA9IG5ldyBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwoKTtcblx0XHRcdFx0dGhpcy5sYXN0TWUuYXZhdGFyID0gdGhpcy5tZS5wcm9maWxlSW1hZ2U7XG5cdFx0XHRcdHRoaXMubGFzdE1lLnVzZXJuYW1lID0gdGhpcy5tZS51c2VybmFtZTtcblxuXHRcdFx0XHQvLyBTYXZlIHRvIExTXG5cdFx0XHRcdHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0KHRoaXMuY29uZmlnLmxhc3RNZUF2YXRhckxzS2V5LCB0aGlzLm1lLnByb2ZpbGVJbWFnZSk7XG5cdFx0XHRcdHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0KHRoaXMuY29uZmlnLmxhc3RNZVVzZXJuYW1lTHNLZXksIHRoaXMubWUudXNlcm5hbWUpO1xuXG5cdFx0XHRcdC8vIFJlc3RvcmVcblx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnJlc3RvcmVBcGlSZXNwb25zZVN0cmF0ZWd5KCk7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1lO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9XG5cblx0cHVibGljIHJlZnJlc2hUb2tlbigpOiBPYnNlcnZhYmxlPE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsPiB7XG5cdFx0Ly8gR2V0IHJlZnJlc2ggdG9rZW5cblx0XHRjb25zdCByZWZyZXNoVG9rZW46IHN0cmluZyA9IHRoaXMuYWNjZXNzVG9rZW4gaW5zdGFuY2VvZiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCA/IHRoaXMuYWNjZXNzVG9rZW4ucmVmcmVzaFRva2VuIDogJyc7XG5cblx0XHQvLyBTZXQgcm9vdCBzdHJhdGVneVxuXHRcdHRoaXMuYXBpU2VydmljZS5jaGFuZ2VBcGlSZXNwb25zZVN0cmF0ZWd5KCdyb290Jyk7XG5cblx0XHQvLyBSZXF1ZXN0IHRva2VuXG5cdFx0cmV0dXJuIHRoaXMuYXBpU2VydmljZS5jcmVhdGVPYmoodGhpcy5jb25maWcub2F1dGhVcmksIHtcblx0XHRcdHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbixcblx0XHRcdGdyYW50X3R5cGU6IHRoaXMuY29uZmlnLmdyYW50VHlwZVJlZnJlc2gsXG5cdFx0XHRjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmNsaWVudElkXG5cdFx0fSkucGlwZShcblx0XHRcdG1hcCgocmVzcG9uc2U6IEFwaVJlc3BvbnNlTW9kZWwpID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgcmVzcG9uc2Vcblx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEpIHtcblx0XHRcdFx0XHQvLyBMb2FkIHRoZSByZWZyZXNoIHRva2VuXG5cdFx0XHRcdFx0cmVzcG9uc2UuZGF0YS5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaFRva2VuO1xuXG5cdFx0XHRcdFx0Ly8gU2F2ZSB0byBMU1xuXHRcdFx0XHRcdHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0KHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuTHNLZXksIHJlc3BvbnNlLmRhdGEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ3JlYXRlcyB0aGUgYWNjZXNzIHRva2VuIG1vZGVsXG5cdFx0XHRcdHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLnBhcnNlQWNjZXNzVG9rZW4ocmVzcG9uc2UuZGF0YSk7XG5cblx0XHRcdFx0Ly8gTG9hZCB0byBhcGlTZXJ2aWNlIHRvXG5cdFx0XHRcdHRoaXMuYXBpU2VydmljZS5zZXRBY2Nlc3NUb2tlbih0aGlzLmFjY2Vzc1Rva2VuLnRva2VuKTtcblxuXHRcdFx0XHQvLyBSZXN0b3JlXG5cdFx0XHRcdHRoaXMuYXBpU2VydmljZS5yZXN0b3JlQXBpUmVzcG9uc2VTdHJhdGVneSgpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbjtcblx0XHRcdH0pXG5cdFx0KTtcblx0fVxuXG5cdHB1YmxpYyBsb2FkU2Vzc2lvbigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHQvLyBDcmVhdGUgYW4gb2JzZXJ2YWJsZVxuXHRcdGNvbnN0IG9icyA9IG5ldyBPYnNlcnZhYmxlPGJvb2xlYW4+KChvYnNlcnZlcjogYW55KSA9PiB7XG5cdFx0XHRjb25zdCBhY2Nlc3NUb2tlbkxzOiBhbnkgPSB0aGlzLnN0b3JhZ2VTZXJ2aWNlLmdldCh0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbkxzS2V5KTtcblx0XHRcdGNvbnN0IGxhc3RNZUF2YXRhcjogc3RyaW5nID0gdGhpcy5zdG9yYWdlU2VydmljZS5nZXQodGhpcy5jb25maWcubGFzdE1lQXZhdGFyTHNLZXkpO1xuXHRcdFx0Y29uc3QgbGFzdE1lVXNlcm5hbWU6IHN0cmluZyA9IHRoaXMuc3RvcmFnZVNlcnZpY2UuZ2V0KHRoaXMuY29uZmlnLmxhc3RNZVVzZXJuYW1lTHNLZXkpO1xuXHRcdFx0Y29uc3QgY29tcGxldGVPYnNlcnZhYmxlOiBGdW5jdGlvbiA9IChyZXN1bHQ6IGJvb2xlYW4pID0+IHtcblx0XHRcdFx0b2JzZXJ2ZXIubmV4dChyZXN1bHQpO1xuXHRcdFx0XHRvYnNlcnZlci5jb21wbGV0ZSgpO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gTG9hZCBsYXN0IHVzZXJcblx0XHRcdGlmIChsYXN0TWVVc2VybmFtZSB8fCBsYXN0TWVVc2VybmFtZSkge1xuXHRcdFx0XHR0aGlzLmxhc3RNZSA9IG5ldyBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwoXG5cdFx0XHRcdFx0bGFzdE1lVXNlcm5hbWUsXG5cdFx0XHRcdFx0bGFzdE1lQXZhdGFyXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxhc3RNZSA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoZWNrIGFjY2VzcyB0b2tlbiBnZXR0ZWQgZnJvbSBsc1xuXHRcdFx0aWYgKGFjY2Vzc1Rva2VuTHMpIHtcblx0XHRcdFx0Ly8gQ3JlYXQgYWNjZXNzIHRva2VuXG5cdFx0XHRcdHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLnBhcnNlQWNjZXNzVG9rZW4oYWNjZXNzVG9rZW5Mcyk7XG5cblx0XHRcdFx0Ly8gQ2hlY2sgdG9rZW5cblx0XHRcdFx0aWYgKHRoaXMuYWNjZXNzVG9rZW4gaW5zdGFuY2VvZiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCkge1xuXHRcdFx0XHRcdC8vIEhhcyBjb25maWd1cmVkIG1lXG5cdFx0XHRcdFx0aWYgKHRoaXMuY29uZmlnLm9hdXRoTWVVcmkpIHtcblx0XHRcdFx0XHRcdC8vIExvYWQgdG8gYXBpU2VydmljZSB0b1xuXHRcdFx0XHRcdFx0dGhpcy5hcGlTZXJ2aWNlLnNldEFjY2Vzc1Rva2VuKHRoaXMuYWNjZXNzVG9rZW4udG9rZW4pO1xuXG5cdFx0XHRcdFx0XHQvLyBSZXF1ZXN0IG1lIGluZm9cblx0XHRcdFx0XHRcdHRoaXMucmVxdWVzdE1lKCkuc3Vic2NyaWJlKFxuXHRcdFx0XHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gTm90aWZ5IHVzZXIgc3RhdGVcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmNoZWNrQW5kTm90aWZ5TWVTdGF0ZSgpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmluaXNoIGxvYWRcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHQvLyBGaW5pc2ggbG9hZFxuXHRcdFx0XHRcdFx0XHRcdGNvbXBsZXRlT2JzZXJ2YWJsZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIExvYWQgc3VjY2VzcyB3aXRob3V0IG1lXG5cdFx0XHRcdFx0XHRjb21wbGV0ZU9ic2VydmFibGUodHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEZpbmlzaCBsb2FkXG5cdFx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRmluaXNoIGxvYWRcblx0XHRcdFx0Y29tcGxldGVPYnNlcnZhYmxlKGZhbHNlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gb2JzO1xuXHR9XG5cblx0cHVibGljIGxvZ291dCgpOiB2b2lkIHtcblx0XHQvLyBDbGVhciBMb2NhbCBzdG9yYWdlXG5cdFx0dGhpcy5zdG9yYWdlU2VydmljZS5yZW1vdmUodGhpcy5jb25maWcuYWNjZXNzVG9rZW5Mc0tleSk7XG5cblx0XHQvLyBDbGVhciBkYXRhIGluIG1lbW9yeVxuXHRcdHRoaXMubWUgPSBudWxsO1xuXHRcdHRoaXMuYWNjZXNzVG9rZW4gPSBudWxsO1xuXG5cdFx0Ly8gRW1pdCBzdGF0ZSBjaGFuZ2Vcblx0XHR0aGlzLmNoZWNrQW5kTm90aWZ5TWVTdGF0ZSgpO1xuXHR9XG5cblx0cHVibGljIGNoZWNrQW5kTm90aWZ5TWVTdGF0ZSgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5tZSBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpNZU1vZGVsICYmIHRoaXMuYWNjZXNzVG9rZW4gaW5zdGFuY2VvZiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCkge1xuXHRcdFx0Ly8gRW1pdCBsb2dpbiBldmVudFxuXHRcdFx0dGhpcy5vblNlc3Npb25TdGF0ZUNoYW5nZS5lbWl0KHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBFbWl0IGxvZ2luIGV2ZW50XG5cdFx0XHR0aGlzLm9uU2Vzc2lvblN0YXRlQ2hhbmdlLmVtaXQoZmFsc2UpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVNZShtZTogTmd4R3VzdGF2Z3Vlek1lTW9kZWwpOiB2b2lkIHtcblx0XHR0aGlzLm1lID0gbWU7XG5cblx0XHQvLyBFbWl0IGNoYW5nZVxuXHRcdHRoaXMub25NZUNoYW5nZWQuZW1pdChtZSk7XG5cdH1cblxuXHQvLyBQcml2YXRlIG1ldGhvZHNcblx0cHJpdmF0ZSBwYXJzZUFjY2Vzc1Rva2VuKGpzb246IGFueSk6IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsIHtcblx0XHRsZXQgYWNjZXNzVG9rZW46IE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsID0gbnVsbDtcblxuXHRcdC8vIENoZWNrIGFjY2VzcyB0b2tlblxuXHRcdGlmIChqc29uICYmIGpzb24uYWNjZXNzX3Rva2VuKSB7XG5cdFx0XHQvLyBwYXJzZSBleHBpcmF0aW9uIGRhdGVcblx0XHRcdGNvbnN0IGV4cGlyYXRpb246IERhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0Y29uc3QgZXhwaXJlc0luOiBudW1iZXIgPSBqc29uLmV4cGlyZXNfaW4gLyA2MDtcblx0XHRcdGV4cGlyYXRpb24uc2V0TWludXRlcyhleHBpcmF0aW9uLmdldE1pbnV0ZXMoKSArIGV4cGlyZXNJbik7XG5cblx0XHRcdC8vIENyZWF0ZXMgdGhlIGFjY2VzcyB0b2tlbiBtb2RlbFxuXHRcdFx0YWNjZXNzVG9rZW4gPSBuZXcgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwoXG5cdFx0XHRcdGpzb24uYWNjZXNzX3Rva2VuLFxuXHRcdFx0XHRqc29uLnJlZnJlc2hfdG9rZW4sXG5cdFx0XHRcdGV4cGlyYXRpb25cblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBhY2Nlc3NUb2tlbjtcblx0fVxufVxuIl19