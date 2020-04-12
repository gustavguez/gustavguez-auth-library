import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { NgxGustavguezAuthService } from './ngx-gustavguez-auth.service';
import { NgxGustavguezAccessTokenModel } from './ngx-gustavguez-access-token.model';
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
export { NgxGustavguezAuthInterceptor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5pbnRlcmNlcHRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndXN0YXZndWV6LWF1dGgvIiwic291cmNlcyI6WyJsaWIvbmd4LWd1c3Rhdmd1ZXotYXV0aC5pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBS04saUJBQWlCLEVBQ2pCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0UsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFHcEY7SUFNQyxzQ0FDUyx3QkFBa0Q7UUFBbEQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUwzRCxTQUFTO1FBQ0Qsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLGlCQUFZLEdBQTRCLElBQUksZUFBZSxDQUFTLElBQUksQ0FBQyxDQUFDO0lBR25CLENBQUM7SUFFaEUsa0JBQWtCO0lBQ1gsZ0RBQVMsR0FBaEIsVUFBaUIsR0FBcUIsRUFBRSxJQUFpQjtRQUF6RCxpQkFxQkM7UUFwQkEsOERBQThEO1FBQzlELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDckIsSUFBSSxDQUNKLFVBQVUsQ0FBQyxVQUFDLEtBQVU7WUFDckIsbUJBQW1CO1lBQ25CLElBQUksS0FBSyxZQUFZLGlCQUFpQixFQUFFO2dCQUN2QyxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUU7b0JBQ3RCLEtBQUssR0FBRzt3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SSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQ2pFLENBQUM7SUFDSixDQUFDO0lBRUQsbUJBQW1CO0lBQ1gscURBQWMsR0FBdEIsVUFBdUIsS0FBd0I7UUFDOUMsSUFBSSxLQUFLLFlBQVksaUJBQWlCO2VBQ2xDLEtBQUssQ0FBQyxNQUFNLEtBQUssR0FBRztlQUNwQixPQUFPLElBQUksS0FBSztlQUNoQixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxlQUFlLEVBQUU7WUFDMUMsb0dBQW9HO1lBQ3BHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEM7UUFFRCxjQUFjO1FBQ2QsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7Z0JBcEdrQyx3QkFBd0I7O0lBUC9DLDRCQUE0QjtRQUR4QyxVQUFVLEVBQUU7T0FDQSw0QkFBNEIsQ0E0R3hDO0lBQUQsbUNBQUM7Q0FBQSxBQTVHRCxJQTRHQztTQTVHWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuXHRIdHRwRXZlbnQsXG5cdEh0dHBJbnRlcmNlcHRvcixcblx0SHR0cEhhbmRsZXIsXG5cdEh0dHBSZXF1ZXN0LFxuXHRIdHRwRXJyb3JSZXNwb25zZVxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGZpbHRlciwgdGFrZSwgc3dpdGNoTWFwLCBmaW5hbGl6ZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWFjY2Vzcy10b2tlbi5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ3hHdXN0YXZndWV6QXV0aEludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblxuXHQvLyBNb2RlbHNcblx0cHJpdmF0ZSBpc1JlZnJlc2hpbmdUb2tlbjogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIHRva2VuU3ViamVjdDogQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4obnVsbCk7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHJpdmF0ZSBuZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2U6IE5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZSkgeyB9XG5cblx0Ly8gSW50ZXJjZXAgbWV0aG9kXG5cdHB1YmxpYyBpbnRlcmNlcHQocmVxOiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcblx0XHQvLyBQYXNzIG9uIHRoZSBjbG9uZWQgcmVxdWVzdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCByZXF1ZXN0LlxuXHRcdHJldHVybiBuZXh0LmhhbmRsZShyZXEpXG5cdFx0XHQucGlwZShcblx0XHRcdFx0Y2F0Y2hFcnJvcigoZXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHRcdC8vIENoZWNrIGVycm9yIHR5cGVcblx0XHRcdFx0XHRpZiAoZXJyb3IgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSkge1xuXHRcdFx0XHRcdFx0c3dpdGNoIChlcnJvci5zdGF0dXMpIHtcblx0XHRcdFx0XHRcdGNhc2UgNDAwOlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGU0MDBFcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHRjYXNlIDQwMTpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuaGFuZGxlNDAxRXJyb3IoZXJyb3IsIHJlcSwgbmV4dCk7XG5cdFx0XHRcdFx0XHRjYXNlIDQwMzpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuaGFuZGxlNDAzRXJyb3IoZXJyb3IpO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gbmV3IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+KCk7XG5cdFx0XHRcdH0pXG5cdFx0XHQpIGFzIGFueTtcblx0fVxuXG5cdC8vIEFkZCBhdXRob3JpemF0aW9uIGhlYWRlciB0byByZXF1ZXN0c1xuXHRwcml2YXRlIGFkZFRva2VuKHJlcTogSHR0cFJlcXVlc3Q8YW55PiwgdG9rZW46IHN0cmluZyk6IEh0dHBSZXF1ZXN0PGFueT4ge1xuXHRcdHJldHVybiByZXEuY2xvbmUoe1xuXHRcdFx0c2V0SGVhZGVyczoge1xuXHRcdFx0XHRBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyB0b2tlblxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gSGVscGVyIGZ1bmN0aW9uIHdoZW4gdGhlIHJlZnJlc2ggdG9rZW4gZG9lc250IHdvcmtcblx0cHJpdmF0ZSBsb2dvdXQoZXJyb3I6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0Ly8gbG9nb3V0IHVzZXJzLCByZWRpcmVjdCB0byBsb2dpbiBwYWdlXG5cdFx0dGhpcy5uZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdFx0cmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIDQwMyBlcnJvclxuXHRwcml2YXRlIGhhbmRsZTQwM0Vycm9yKGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0cmV0dXJuIHRoaXMubG9nb3V0KGVycm9yLm1lc3NhZ2UpO1xuXHR9XG5cblx0Ly8gSGFuZmxlIDQwMSBlcnJvclxuXHRwcml2YXRlIGhhbmRsZTQwMUVycm9yKGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSwgcmVxOiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0Ly8gQEBUT0RPOiBmaW5kIGEgd2F5IHRvIGNvbmZpZ3VyZSBpdFxuXHRcdC8vIElnbm9yZSA0MDEgc3RhdHVzIHdoZW4gdGhlIHVybCBhcmUgT2F1dGhcblx0XHRpZiAocmVxLnVybC5pbmNsdWRlcygnL29hdXRoJykpIHtcblx0XHRcdHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiBpcyByZWZyZXNoaW5nIHRva2VuXG5cdFx0aWYgKCF0aGlzLmlzUmVmcmVzaGluZ1Rva2VuKSB7XG5cdFx0XHR0aGlzLmlzUmVmcmVzaGluZ1Rva2VuID0gdHJ1ZTtcblxuXHRcdFx0Ly8gUmVzZXQgaGVyZSBzbyB0aGF0IHRoZSBmb2xsb3dpbmcgcmVxdWVzdHMgd2FpdCB1bnRpbCB0aGUgdG9rZW5cblx0XHRcdC8vIGNvbWVzIGJhY2sgZnJvbSB0aGUgcmVmcmVzaFRva2VuIGNhbGwuXG5cdFx0XHR0aGlzLnRva2VuU3ViamVjdC5uZXh0KG51bGwpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5uZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UucmVmcmVzaFRva2VuKClcblx0XHRcdFx0LnBpcGUoXG5cdFx0XHRcdFx0c3dpdGNoTWFwKChuZXdUb2tlbjogTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwpID0+IHtcblx0XHRcdFx0XHRcdGlmIChuZXdUb2tlbiBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpBY2Nlc3NUb2tlbk1vZGVsKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudG9rZW5TdWJqZWN0Lm5leHQobmV3VG9rZW4udG9rZW4pO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbmV4dC5oYW5kbGUodGhpcy5hZGRUb2tlbihyZXEsIG5ld1Rva2VuLnRva2VuKSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIElmIHdlIGRvbid0IGdldCBhIG5ldyB0b2tlbiwgd2UgYXJlIGluIHRyb3VibGUgc28gbG9nb3V0LlxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMubG9nb3V0KCdDYW50IGdldCBhIG5ldyB0b2tlbi4nKTtcblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRjYXRjaEVycm9yKChlcnJvckNhdGNoZWQ6IGFueSkgPT4gdGhpcy5sb2dvdXQoZXJyb3JDYXRjaGVkLm1lc3NhZ2UpKSxcblx0XHRcdFx0XHRmaW5hbGl6ZSgoKSA9PiB0aGlzLmlzUmVmcmVzaGluZ1Rva2VuID0gZmFsc2UpXG5cdFx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGFrZSB0aGUgdG9rZW4gYW5kIHJlbGVhc2UgcmVxdWVzdHNcblx0XHRyZXR1cm4gdGhpcy50b2tlblN1YmplY3Rcblx0XHRcdC5waXBlKFxuXHRcdFx0XHRmaWx0ZXIoKHRva2VuOiBhbnkpID0+IHRva2VuICE9PSBudWxsKSxcblx0XHRcdFx0dGFrZSgxKSxcblx0XHRcdFx0c3dpdGNoTWFwKCh0b2tlbjogYW55KSA9PiBuZXh0LmhhbmRsZSh0aGlzLmFkZFRva2VuKHJlcSwgdG9rZW4pKSlcblx0XHRcdCk7XG5cdH1cblxuXHQvLyBIYW5kbGUgNDAwIGVycm9yXG5cdHByaXZhdGUgaGFuZGxlNDAwRXJyb3IoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRpZiAoZXJyb3IgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZVxuXHRcdFx0JiYgZXJyb3Iuc3RhdHVzID09PSA0MDBcblx0XHRcdCYmICdlcnJvcicgaW4gZXJyb3Jcblx0XHRcdCYmIGVycm9yLmVycm9yLmVycm9yID09PSAnaW52YWxpZF9ncmFudCcpIHtcblx0XHRcdC8vIElmIHdlIGdldCBhIDQwMCBhbmQgdGhlIGVycm9yIG1lc3NhZ2UgaXMgJ2ludmFsaWRfZ3JhbnQnLCB0aGUgdG9rZW4gaXMgbm8gbG9uZ2VyIHZhbGlkIHNvIGxvZ291dC5cblx0XHRcdHJldHVybiB0aGlzLmxvZ291dChlcnJvci5tZXNzYWdlKTtcblx0XHR9XG5cblx0XHQvLyBOb3JtYWwgZmxvd1xuXHRcdHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcblx0fVxufVxuIl19