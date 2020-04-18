(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('angular-2-local-storage'), require('ngx-gustavguez-core'), require('rxjs'), require('rxjs/operators'), require('@angular/common/http'), require('@angular/common'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ngx-gustavguez-auth', ['exports', '@angular/core', 'angular-2-local-storage', 'ngx-gustavguez-core', 'rxjs', 'rxjs/operators', '@angular/common/http', '@angular/common', '@angular/forms'], factory) :
    (global = global || self, factory(global['ngx-gustavguez-auth'] = {}, global.ng.core, global.angular2LocalStorage, global.ngxGustavguezCore, global.rxjs, global.rxjs.operators, global.ng.common.http, global.ng.common, global.ng.forms));
}(this, (function (exports, core, angular2LocalStorage, ngxGustavguezCore, rxjs, operators, http, common, forms) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

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
            this.onSessionStateChange = new core.EventEmitter();
            this.onMeChanged = new core.EventEmitter();
            this.onMeParsed = new core.EventEmitter();
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
            var obs = new rxjs.Observable(function (observer) {
                // Set root strategy
                _this.apiService.changeApiResponseStrategy('root');
                // Request token
                _this.apiService.createObj(_this.config.oauthUri, {
                    username: loginUsername,
                    password: loginPassword,
                    grant_type: _this.config.grantType,
                    client_id: _this.config.clientId,
                    client_secret: _this.config.clientSecret
                }).pipe(operators.map(function (response) {
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
            return this.apiService.fetchData(this.config.oauthMeUri).pipe(operators.map(function (response) {
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
            }).pipe(operators.map(function (response) {
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
            var obs = new rxjs.Observable(function (observer) {
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
            { type: angular2LocalStorage.LocalStorageService },
            { type: ngxGustavguezCore.ApiService }
        ]; };
        NgxGustavguezAuthService.ɵprov = core["ɵɵdefineInjectable"]({ factory: function NgxGustavguezAuthService_Factory() { return new NgxGustavguezAuthService(core["ɵɵinject"](angular2LocalStorage.LocalStorageService), core["ɵɵinject"](ngxGustavguezCore.ApiService)); }, token: NgxGustavguezAuthService, providedIn: "root" });
        NgxGustavguezAuthService = __decorate([
            core.Injectable({
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
        NgxGustavguezAuthGuard.ɵprov = core["ɵɵdefineInjectable"]({ factory: function NgxGustavguezAuthGuard_Factory() { return new NgxGustavguezAuthGuard(core["ɵɵinject"](NgxGustavguezAuthService)); }, token: NgxGustavguezAuthGuard, providedIn: "root" });
        NgxGustavguezAuthGuard = __decorate([
            core.Injectable({
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
            this.tokenSubject = new rxjs.BehaviorSubject(null);
        }
        // Intercep method
        NgxGustavguezAuthInterceptor.prototype.intercept = function (req, next) {
            var _this = this;
            // Pass on the cloned request instead of the original request.
            return next.handle(req)
                .pipe(operators.catchError(function (error) {
                // Check error type
                if (error instanceof http.HttpErrorResponse) {
                    switch (error.status) {
                        case 400:
                            return _this.handle400Error(error);
                        case 401:
                            return _this.handle401Error(error, req, next);
                        case 403:
                            return _this.handle403Error(error);
                        default:
                            return rxjs.throwError(error);
                    }
                }
                return new rxjs.Observable();
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
            return rxjs.throwError(error);
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
                return rxjs.throwError(error);
            }
            // Check if is refreshing token
            if (!this.isRefreshingToken) {
                this.isRefreshingToken = true;
                // Reset here so that the following requests wait until the token
                // comes back from the refreshToken call.
                this.tokenSubject.next(null);
                return this.ngxGustavguezAuthService.refreshToken()
                    .pipe(operators.switchMap(function (newToken) {
                    if (newToken instanceof NgxGustavguezAccessTokenModel) {
                        _this.tokenSubject.next(newToken.token);
                        return next.handle(_this.addToken(req, newToken.token));
                    }
                    // If we don't get a new token, we are in trouble so logout.
                    return _this.logout('Cant get a new token.');
                }), operators.catchError(function (errorCatched) { return _this.logout(errorCatched.message); }), operators.finalize(function () { return _this.isRefreshingToken = false; }));
            }
            // Take the token and release requests
            return this.tokenSubject
                .pipe(operators.filter(function (token) { return token !== null; }), operators.take(1), operators.switchMap(function (token) { return next.handle(_this.addToken(req, token)); }));
        };
        // Handle 400 error
        NgxGustavguezAuthInterceptor.prototype.handle400Error = function (error) {
            if (error instanceof http.HttpErrorResponse
                && error.status === 400
                && 'error' in error
                && error.error.error === 'invalid_grant') {
                // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
                return this.logout(error.message);
            }
            // Normal flow
            return rxjs.throwError(error);
        };
        NgxGustavguezAuthInterceptor.ctorParameters = function () { return [
            { type: NgxGustavguezAuthService }
        ]; };
        NgxGustavguezAuthInterceptor = __decorate([
            core.Injectable()
        ], NgxGustavguezAuthInterceptor);
        return NgxGustavguezAuthInterceptor;
    }());

    var NgxGustavguezAuthLoginComponent = /** @class */ (function () {
        // Component constructor
        function NgxGustavguezAuthLoginComponent(ngxGustavguezAuthService, fb) {
            this.ngxGustavguezAuthService = ngxGustavguezAuthService;
            this.fb = fb;
            // Outputs
            this.onSuccess = new core.EventEmitter();
            this.onError = new core.EventEmitter();
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
                username: this.fb.control('', [forms.Validators.required]),
                password: this.fb.control('', [forms.Validators.required])
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
                ngxGustavguezCore.FormUtility.validateAllFormFields(this.form);
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
            { type: forms.FormBuilder }
        ]; };
        __decorate([
            core.Input()
        ], NgxGustavguezAuthLoginComponent.prototype, "imageUrl", void 0);
        __decorate([
            core.Input()
        ], NgxGustavguezAuthLoginComponent.prototype, "usernamePlaceholder", void 0);
        __decorate([
            core.Input()
        ], NgxGustavguezAuthLoginComponent.prototype, "passwordPlaceholder", void 0);
        __decorate([
            core.Input()
        ], NgxGustavguezAuthLoginComponent.prototype, "submitText", void 0);
        __decorate([
            core.Output()
        ], NgxGustavguezAuthLoginComponent.prototype, "onSuccess", void 0);
        __decorate([
            core.Output()
        ], NgxGustavguezAuthLoginComponent.prototype, "onError", void 0);
        NgxGustavguezAuthLoginComponent = __decorate([
            core.Component({
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
            core.NgModule({
                declarations: [NgxGustavguezAuthLoginComponent],
                imports: [
                    common.CommonModule,
                    angular2LocalStorage.LocalStorageModule,
                    forms.ReactiveFormsModule,
                    ngxGustavguezCore.NgxGustavguezCoreModule
                ],
                providers: [
                    {
                        provide: http.HTTP_INTERCEPTORS,
                        useClass: NgxGustavguezAuthInterceptor,
                        multi: true
                    }
                ],
                exports: [NgxGustavguezAuthLoginComponent]
            })
        ], NgxGustavguezAuthModule);
        return NgxGustavguezAuthModule;
    }());

    exports.NgxGustavguezAccessTokenModel = NgxGustavguezAccessTokenModel;
    exports.NgxGustavguezAuthGuard = NgxGustavguezAuthGuard;
    exports.NgxGustavguezAuthInterceptor = NgxGustavguezAuthInterceptor;
    exports.NgxGustavguezAuthLoginComponent = NgxGustavguezAuthLoginComponent;
    exports.NgxGustavguezAuthModule = NgxGustavguezAuthModule;
    exports.NgxGustavguezAuthService = NgxGustavguezAuthService;
    exports.NgxGustavguezConfigModel = NgxGustavguezConfigModel;
    exports.NgxGustavguezLastMeModel = NgxGustavguezLastMeModel;
    exports.NgxGustavguezMeModel = NgxGustavguezMeModel;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-gustavguez-auth.umd.js.map
