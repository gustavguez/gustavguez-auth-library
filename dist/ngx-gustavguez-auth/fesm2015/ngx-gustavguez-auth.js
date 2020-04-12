import { __decorate } from 'tslib';
import { EventEmitter, ɵɵdefineInjectable, ɵɵinject, Injectable, Input, Output, Component, NgModule } from '@angular/core';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { ApiService, FormUtility, NgxGustavguezCoreModule } from 'ngx-gustavguez-core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

class NgxGustavguezAccessTokenModel {
    constructor(token, refreshToken, expiration) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiration = expiration;
    }
}

class NgxGustavguezLastMeModel {
    constructor(username, avatar) {
        this.username = username;
        this.avatar = avatar;
    }
}

class NgxGustavguezMeModel {
    constructor(id, username, firstName, lastName, profileImage, data) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImage = profileImage;
        this.data = data;
    }
    fromJSON(json) {
        if (json) {
            this.id = json.id;
            this.username = json.username;
            this.firstName = json.firstName;
            this.lastName = json.lastName;
            this.profileImage = json.profileImage;
        }
    }
}

class NgxGustavguezConfigModel {
    constructor(grantType, grantTypeRefresh, clientId, clientSecret, accessTokenLsKey, lastMeAvatarLsKey, lastMeUsernameLsKey, oauthUri, oauthRefreshUri, oauthMeUri) {
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
}

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
NgxGustavguezAuthService.ɵprov = ɵɵdefineInjectable({ factory: function NgxGustavguezAuthService_Factory() { return new NgxGustavguezAuthService(ɵɵinject(LocalStorageService), ɵɵinject(ApiService)); }, token: NgxGustavguezAuthService, providedIn: "root" });
NgxGustavguezAuthService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], NgxGustavguezAuthService);

let NgxGustavguezAuthGuard = class NgxGustavguezAuthGuard {
    constructor(ngxGustavguezAuthService) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
    }
    canActivate() {
        // Active user session?
        if (this.ngxGustavguezAuthService.isLogged()) {
            return true;
        }
        // Redirect login form
        this.ngxGustavguezAuthService.checkAndNotifyMeState();
        return false;
    }
};
NgxGustavguezAuthGuard.ctorParameters = () => [
    { type: NgxGustavguezAuthService }
];
NgxGustavguezAuthGuard.ɵprov = ɵɵdefineInjectable({ factory: function NgxGustavguezAuthGuard_Factory() { return new NgxGustavguezAuthGuard(ɵɵinject(NgxGustavguezAuthService)); }, token: NgxGustavguezAuthGuard, providedIn: "root" });
NgxGustavguezAuthGuard = __decorate([
    Injectable({
        providedIn: 'root',
    })
], NgxGustavguezAuthGuard);

let NgxGustavguezAuthInterceptor = class NgxGustavguezAuthInterceptor {
    constructor(ngxGustavguezAuthService) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
        // Models
        this.isRefreshingToken = false;
        this.tokenSubject = new BehaviorSubject(null);
    }
    // Intercep method
    intercept(req, next) {
        // Pass on the cloned request instead of the original request.
        return next.handle(req)
            .pipe(catchError((error) => {
            // Check error type
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 400:
                        return this.handle400Error(error);
                    case 401:
                        return this.handle401Error(error, req, next);
                    case 403:
                        return this.handle403Error(error);
                    default:
                        return throwError(error);
                }
            }
            return new Observable();
        }));
    }
    // Add authorization header to requests
    addToken(req, token) {
        return req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });
    }
    // Helper function when the refresh token doesnt work
    logout(error) {
        // logout users, redirect to login page
        this.ngxGustavguezAuthService.logout();
        return throwError(error);
    }
    // Handle 403 error
    handle403Error(error) {
        return this.logout(error.message);
    }
    // Hanfle 401 error
    handle401Error(error, req, next) {
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
                .pipe(switchMap((newToken) => {
                if (newToken instanceof NgxGustavguezAccessTokenModel) {
                    this.tokenSubject.next(newToken.token);
                    return next.handle(this.addToken(req, newToken.token));
                }
                // If we don't get a new token, we are in trouble so logout.
                return this.logout('Cant get a new token.');
            }), catchError((errorCatched) => this.logout(errorCatched.message)), finalize(() => this.isRefreshingToken = false));
        }
        // Take the token and release requests
        return this.tokenSubject
            .pipe(filter((token) => token !== null), take(1), switchMap((token) => next.handle(this.addToken(req, token))));
    }
    // Handle 400 error
    handle400Error(error) {
        if (error instanceof HttpErrorResponse
            && error.status === 400
            && 'error' in error
            && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            return this.logout(error.message);
        }
        // Normal flow
        return throwError(error);
    }
};
NgxGustavguezAuthInterceptor.ctorParameters = () => [
    { type: NgxGustavguezAuthService }
];
NgxGustavguezAuthInterceptor = __decorate([
    Injectable()
], NgxGustavguezAuthInterceptor);

let NgxGustavguezAuthLoginComponent = class NgxGustavguezAuthLoginComponent {
    // Component constructor
    constructor(ngxGustavguezAuthService, fb) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
        this.fb = fb;
        // Outputs
        this.onSuccess = new EventEmitter();
        this.onError = new EventEmitter();
    }
    // Events
    ngOnInit() {
        // Init loading
        this.loading = false;
        // Check last logged avatar
        if (this.ngxGustavguezAuthService.getLastMe() instanceof NgxGustavguezLastMeModel) {
            const lastMe = this.ngxGustavguezAuthService.getLastMe();
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
    }
    onSubmit() {
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
                .subscribe((result) => {
                // Stop loading
                this.loading = false;
                // Check result
                if (result) {
                    // Emit success
                    this.onSuccess.emit();
                }
            }, (error) => {
                // Stop loading
                this.loading = false;
                // Emit error
                this.onError.emit(error);
            });
        }
        else {
            // Display error
            FormUtility.validateAllFormFields(this.form);
        }
    }
    onUsernameChange() {
        // Check different
        if (this.lastUsername !== this.form.value.username) {
            this.lastAvatar = null;
        }
    }
    initForm() {
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
    }
};
NgxGustavguezAuthLoginComponent.ctorParameters = () => [
    { type: NgxGustavguezAuthService },
    { type: FormBuilder }
];
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

let NgxGustavguezAuthModule = class NgxGustavguezAuthModule {
};
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

/*
 * Public API Surface of ngx-gustavguez-auth
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxGustavguezAccessTokenModel, NgxGustavguezAuthGuard, NgxGustavguezAuthInterceptor, NgxGustavguezAuthLoginComponent, NgxGustavguezAuthModule, NgxGustavguezAuthService, NgxGustavguezConfigModel, NgxGustavguezLastMeModel, NgxGustavguezMeModel };
//# sourceMappingURL=ngx-gustavguez-auth.js.map
