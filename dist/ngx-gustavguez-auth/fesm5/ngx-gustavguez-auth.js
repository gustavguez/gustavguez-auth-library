import { __decorate } from 'tslib';
import { EventEmitter, ɵɵdefineInjectable, ɵɵinject, Injectable, Input, Output, Component, NgModule } from '@angular/core';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { ApiService, FormUtility, NgxGustavguezCoreModule } from 'ngx-gustavguez-core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

var NgxGustavguezAccessTokenModel = /** @class */ (function () {
    function NgxGustavguezAccessTokenModel(token, refreshToken, expiration) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiration = expiration;
    }
    return NgxGustavguezAccessTokenModel;
}());

var NgxGustavguezLastMeModel = /** @class */ (function () {
    function NgxGustavguezLastMeModel(username, avatar) {
        this.username = username;
        this.avatar = avatar;
    }
    return NgxGustavguezLastMeModel;
}());

var NgxGustavguezMeModel = /** @class */ (function () {
    function NgxGustavguezMeModel(id, username, firstName, lastName, profileImage, data) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImage = profileImage;
        this.data = data;
    }
    NgxGustavguezMeModel.prototype.fromJSON = function (json) {
        if (json) {
            this.id = json.id;
            this.username = json.username;
            this.firstName = json.firstName;
            this.lastName = json.lastName;
            this.profileImage = json.profileImage;
        }
    };
    return NgxGustavguezMeModel;
}());

var NgxGustavguezConfigModel = /** @class */ (function () {
    function NgxGustavguezConfigModel(grantType, grantTypeRefresh, clientId, clientSecret, accessTokenLsKey, lastMeAvatarLsKey, lastMeUsernameLsKey, oauthUri, oauthRefreshUri, oauthMeUri) {
        this.grantType = grantType;
        this.grantTypeRefresh = grantTypeRefresh;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessTokenLsKey = accessTokenLsKey;
        this.lastMeAvatarLsKey = lastMeAvatarLsKey;
        this.lastMeUsernameLsKey = lastMeUsernameLsKey;
        this.oauthUri = oauthUri;
        this.oauthRefreshUri = oauthRefreshUri;
        this.oauthMeUri = oauthMeUri;
    }
    return NgxGustavguezConfigModel;
}());

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
    NgxGustavguezAuthService.ɵprov = ɵɵdefineInjectable({ factory: function NgxGustavguezAuthService_Factory() { return new NgxGustavguezAuthService(ɵɵinject(LocalStorageService), ɵɵinject(ApiService)); }, token: NgxGustavguezAuthService, providedIn: "root" });
    NgxGustavguezAuthService = __decorate([
        Injectable({
            providedIn: 'root',
        })
    ], NgxGustavguezAuthService);
    return NgxGustavguezAuthService;
}());

var NgxGustavguezAuthGuard = /** @class */ (function () {
    function NgxGustavguezAuthGuard(ngxGustavguezAuthService) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
    }
    NgxGustavguezAuthGuard.prototype.canActivate = function () {
        // Active user session?
        if (this.ngxGustavguezAuthService.isLogged()) {
            return true;
        }
        // Redirect login form
        this.ngxGustavguezAuthService.checkAndNotifyMeState();
        return false;
    };
    NgxGustavguezAuthGuard.ctorParameters = function () { return [
        { type: NgxGustavguezAuthService }
    ]; };
    NgxGustavguezAuthGuard.ɵprov = ɵɵdefineInjectable({ factory: function NgxGustavguezAuthGuard_Factory() { return new NgxGustavguezAuthGuard(ɵɵinject(NgxGustavguezAuthService)); }, token: NgxGustavguezAuthGuard, providedIn: "root" });
    NgxGustavguezAuthGuard = __decorate([
        Injectable({
            providedIn: 'root',
        })
    ], NgxGustavguezAuthGuard);
    return NgxGustavguezAuthGuard;
}());

var NgxGustavguezAuthInterceptor = /** @class */ (function () {
    function NgxGustavguezAuthInterceptor(ngxGustavguezAuthService) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
        // Models
        this.isRefreshingToken = false;
        this.tokenSubject = new BehaviorSubject(null);
    }
    // Intercep method
    NgxGustavguezAuthInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        // Pass on the cloned request instead of the original request.
        return next.handle(req)
            .pipe(catchError(function (error) {
            // Check error type
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 400:
                        return _this.handle400Error(error);
                    case 401:
                        return _this.handle401Error(error, req, next);
                    case 403:
                        return _this.handle403Error(error);
                    default:
                        return throwError(error);
                }
            }
            return new Observable();
        }));
    };
    // Add authorization header to requests
    NgxGustavguezAuthInterceptor.prototype.addToken = function (req, token) {
        return req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });
    };
    // Helper function when the refresh token doesnt work
    NgxGustavguezAuthInterceptor.prototype.logout = function (error) {
        // logout users, redirect to login page
        this.ngxGustavguezAuthService.logout();
        return throwError(error);
    };
    // Handle 403 error
    NgxGustavguezAuthInterceptor.prototype.handle403Error = function (error) {
        return this.logout(error.message);
    };
    // Hanfle 401 error
    NgxGustavguezAuthInterceptor.prototype.handle401Error = function (error, req, next) {
        var _this = this;
        // @@TODO: find a way to configure it
        // Ignore 401 status when the url are Oauth
        if (req.url.includes('/oauth')) {
            return throwError(error);
        }
        // Check if is refreshing token
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);
            return this.ngxGustavguezAuthService.refreshToken()
                .pipe(switchMap(function (newToken) {
                if (newToken instanceof NgxGustavguezAccessTokenModel) {
                    _this.tokenSubject.next(newToken.token);
                    return next.handle(_this.addToken(req, newToken.token));
                }
                // If we don't get a new token, we are in trouble so logout.
                return _this.logout('Cant get a new token.');
            }), catchError(function (errorCatched) { return _this.logout(errorCatched.message); }), finalize(function () { return _this.isRefreshingToken = false; }));
        }
        // Take the token and release requests
        return this.tokenSubject
            .pipe(filter(function (token) { return token !== null; }), take(1), switchMap(function (token) { return next.handle(_this.addToken(req, token)); }));
    };
    // Handle 400 error
    NgxGustavguezAuthInterceptor.prototype.handle400Error = function (error) {
        if (error instanceof HttpErrorResponse
            && error.status === 400
            && 'error' in error
            && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            return this.logout(error.message);
        }
        // Normal flow
        return throwError(error);
    };
    NgxGustavguezAuthInterceptor.ctorParameters = function () { return [
        { type: NgxGustavguezAuthService }
    ]; };
    NgxGustavguezAuthInterceptor = __decorate([
        Injectable()
    ], NgxGustavguezAuthInterceptor);
    return NgxGustavguezAuthInterceptor;
}());

var NgxGustavguezAuthLoginComponent = /** @class */ (function () {
    // Component constructor
    function NgxGustavguezAuthLoginComponent(ngxGustavguezAuthService, fb) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
        this.fb = fb;
        // Outputs
        this.onSuccess = new EventEmitter();
        this.onError = new EventEmitter();
    }
    // Events
    NgxGustavguezAuthLoginComponent.prototype.ngOnInit = function () {
        // Init loading
        this.loading = false;
        // Check last logged avatar
        if (this.ngxGustavguezAuthService.getLastMe() instanceof NgxGustavguezLastMeModel) {
            var lastMe = this.ngxGustavguezAuthService.getLastMe();
            this.lastAvatar = this.imageUrl + lastMe.avatar;
            this.lastUsername = lastMe.username;
        }
        // Creates the form
        this.form = this.fb.group({
            username: this.fb.control('', [Validators.required]),
            password: this.fb.control('', [Validators.required])
        });
        // Check state
        if (this.ngxGustavguezAuthService.isLogged()) {
            // Emit success
            this.onSuccess.emit();
            return;
        }
        // Inital clear
        this.initForm();
    };
    NgxGustavguezAuthLoginComponent.prototype.onSubmit = function () {
        var _this = this;
        // Check loading
        if (this.loading) {
            return;
        }
        // Check allways form validation
        if (this.form.valid) {
            // Set loading
            this.loading = true;
            // Submit the form
            this.ngxGustavguezAuthService
                .login(this.form.value.username, this.form.value.password)
                .subscribe(function (result) {
                // Stop loading
                _this.loading = false;
                // Check result
                if (result) {
                    // Emit success
                    _this.onSuccess.emit();
                }
            }, function (error) {
                // Stop loading
                _this.loading = false;
                // Emit error
                _this.onError.emit(error);
            });
        }
        else {
            // Display error
            FormUtility.validateAllFormFields(this.form);
        }
    };
    NgxGustavguezAuthLoginComponent.prototype.onUsernameChange = function () {
        // Check different
        if (this.lastUsername !== this.form.value.username) {
            this.lastAvatar = null;
        }
    };
    NgxGustavguezAuthLoginComponent.prototype.initForm = function () {
        // Clear form
        this.form.reset();
        // Check last username
        if (this.lastUsername) {
            this.form.patchValue({
                username: this.lastUsername
            });
        }
        // Stop loading
        this.loading = false;
    };
    NgxGustavguezAuthLoginComponent.ctorParameters = function () { return [
        { type: NgxGustavguezAuthService },
        { type: FormBuilder }
    ]; };
    __decorate([
        Input()
    ], NgxGustavguezAuthLoginComponent.prototype, "imageUrl", void 0);
    __decorate([
        Input()
    ], NgxGustavguezAuthLoginComponent.prototype, "usernamePlaceholder", void 0);
    __decorate([
        Input()
    ], NgxGustavguezAuthLoginComponent.prototype, "passwordPlaceholder", void 0);
    __decorate([
        Input()
    ], NgxGustavguezAuthLoginComponent.prototype, "submitText", void 0);
    __decorate([
        Output()
    ], NgxGustavguezAuthLoginComponent.prototype, "onSuccess", void 0);
    __decorate([
        Output()
    ], NgxGustavguezAuthLoginComponent.prototype, "onError", void 0);
    NgxGustavguezAuthLoginComponent = __decorate([
        Component({
            selector: 'ngx-gustavguez-auth-login',
            template: "<form [formGroup]=\"form\" (submit)=\"onSubmit()\">\n\t\t\t\t\t\n\t<div class=\"logo text-center\">\n\t\t<div \n\t\t\t[style.background]=\"'url(' + (lastAvatar ? lastAvatar : 'assets/images/logo.png') + ')'\" \n\t\t\tclass=\"img rounded-circle border border-dark\"></div>\n\t</div>\n\n\t<ngx-gustavguez-input-holder \n\t\tcontrolName=\"username\"\n\t\t[form]=\"form\">\n\t\t<input \n\t\t\ttype=\"text\" \n\t\t\tclass=\"form-control\" \n\t\t\tformControlName=\"username\"\n\t\t\ttype=\"text\" \n\t\t\t(change)=\"onUsernameChange()\"\n\t\t\t[placeholder]=\"usernamePlaceholder ? usernamePlaceholder : ''\">\n\t</ngx-gustavguez-input-holder>\n\n\t<ngx-gustavguez-input-holder \n\t\tcontrolName=\"password\"\n\t\t[form]=\"form\">\n\t\t<input \n\t\t\ttype=\"password\" \n\t\t\tclass=\"form-control\" \n\t\t\tformControlName=\"password\"\n\t\t\t[placeholder]=\"passwordPlaceholder ? passwordPlaceholder : ''\" \n\t\t\tautocomplete=\"false\">\n\t</ngx-gustavguez-input-holder>\n\t\n\t<div class=\"form-group\">\n\t\t<ngx-gustavguez-submit \n\t\t\t[loading]=\"loading\"\n\t\t\t[text]=\"submitText ? submitText : 'Login'\"></ngx-gustavguez-submit>\n\t</div>      \n</form>",
            styles: [".logo .img{width:110px;height:110px;background-size:contain!important;margin-bottom:10px;display:inline-block;background-repeat:no-repeat!important;background-position:center center!important}"]
        })
    ], NgxGustavguezAuthLoginComponent);
    return NgxGustavguezAuthLoginComponent;
}());

var NgxGustavguezAuthModule = /** @class */ (function () {
    function NgxGustavguezAuthModule() {
    }
    NgxGustavguezAuthModule = __decorate([
        NgModule({
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
    ], NgxGustavguezAuthModule);
    return NgxGustavguezAuthModule;
}());

/*
 * Public API Surface of ngx-gustavguez-auth
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxGustavguezAccessTokenModel, NgxGustavguezAuthGuard, NgxGustavguezAuthInterceptor, NgxGustavguezAuthLoginComponent, NgxGustavguezAuthModule, NgxGustavguezAuthService, NgxGustavguezConfigModel, NgxGustavguezLastMeModel, NgxGustavguezMeModel };
//# sourceMappingURL=ngx-gustavguez-auth.js.map
