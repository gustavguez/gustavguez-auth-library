import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { NgxGustavguezAuthService } from './ngx-gustavguez-auth.service';
import { NgxGustavguezAccessTokenModel } from './ngx-gustavguez-access-token.model';
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
export { NgxGustavguezAuthInterceptor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5pbnRlcmNlcHRvci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndXN0YXZndWV6LWF1dGgvIiwic291cmNlcyI6WyJsaWIvbmd4LWd1c3Rhdmd1ZXotYXV0aC5pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBS04saUJBQWlCLEVBQ2pCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0UsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFHcEYsSUFBYSw0QkFBNEIsR0FBekMsTUFBYSw0QkFBNEI7SUFNeEMsWUFDUyx3QkFBa0Q7UUFBbEQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUwzRCxTQUFTO1FBQ0Qsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLGlCQUFZLEdBQTRCLElBQUksZUFBZSxDQUFTLElBQUksQ0FBQyxDQUFDO0lBR25CLENBQUM7SUFFaEUsa0JBQWtCO0lBQ1gsU0FBUyxDQUFDLEdBQXFCLEVBQUUsSUFBaUI7UUFDeEQsOERBQThEO1FBQzlELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDckIsSUFBSSxDQUNKLFVBQVUsQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQ3pCLG1CQUFtQjtZQUNuQixJQUFJLEtBQUssWUFBWSxpQkFBaUIsRUFBRTtnQkFDdkMsUUFBUSxLQUFLLENBQUMsTUFBTSxFQUFF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QUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FDakUsQ0FBQztJQUNKLENBQUM7SUFFRCxtQkFBbUI7SUFDWCxjQUFjLENBQUMsS0FBd0I7UUFDOUMsSUFBSSxLQUFLLFlBQVksaUJBQWlCO2VBQ2xDLEtBQUssQ0FBQyxNQUFNLEtBQUssR0FBRztlQUNwQixPQUFPLElBQUksS0FBSztlQUNoQixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxlQUFlLEVBQUU7WUFDMUMsb0dBQW9HO1lBQ3BHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEM7UUFFRCxjQUFjO1FBQ2QsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNELENBQUE7O1lBckdtQyx3QkFBd0I7O0FBUC9DLDRCQUE0QjtJQUR4QyxVQUFVLEVBQUU7R0FDQSw0QkFBNEIsQ0E0R3hDO1NBNUdZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG5cdEh0dHBFdmVudCxcblx0SHR0cEludGVyY2VwdG9yLFxuXHRIdHRwSGFuZGxlcixcblx0SHR0cFJlcXVlc3QsXG5cdEh0dHBFcnJvclJlc3BvbnNlXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZmlsdGVyLCB0YWtlLCBzd2l0Y2hNYXAsIGZpbmFsaXplIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWF1dGguc2VydmljZSc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotYWNjZXNzLXRva2VuLm1vZGVsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5neEd1c3Rhdmd1ZXpBdXRoSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuXG5cdC8vIE1vZGVsc1xuXHRwcml2YXRlIGlzUmVmcmVzaGluZ1Rva2VuOiBib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgdG9rZW5TdWJqZWN0OiBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPihudWxsKTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIG5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZTogTmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlKSB7IH1cblxuXHQvLyBJbnRlcmNlcCBtZXRob2Rcblx0cHVibGljIGludGVyY2VwdChyZXE6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuXHRcdC8vIFBhc3Mgb24gdGhlIGNsb25lZCByZXF1ZXN0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIHJlcXVlc3QuXG5cdFx0cmV0dXJuIG5leHQuaGFuZGxlKHJlcSlcblx0XHRcdC5waXBlKFxuXHRcdFx0XHRjYXRjaEVycm9yKChlcnJvcjogYW55KSA9PiB7XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZXJyb3IgdHlwZVxuXHRcdFx0XHRcdGlmIChlcnJvciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKGVycm9yLnN0YXR1cykge1xuXHRcdFx0XHRcdFx0Y2FzZSA0MDA6XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmhhbmRsZTQwMEVycm9yKGVycm9yKTtcblx0XHRcdFx0XHRcdGNhc2UgNDAxOlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGU0MDFFcnJvcihlcnJvciwgcmVxLCBuZXh0KTtcblx0XHRcdFx0XHRcdGNhc2UgNDAzOlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5oYW5kbGU0MDNFcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBuZXcgT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4oKTtcblx0XHRcdFx0fSlcblx0XHRcdCkgYXMgYW55O1xuXHR9XG5cblx0Ly8gQWRkIGF1dGhvcml6YXRpb24gaGVhZGVyIHRvIHJlcXVlc3RzXG5cdHByaXZhdGUgYWRkVG9rZW4ocmVxOiBIdHRwUmVxdWVzdDxhbnk+LCB0b2tlbjogc3RyaW5nKTogSHR0cFJlcXVlc3Q8YW55PiB7XG5cdFx0cmV0dXJuIHJlcS5jbG9uZSh7XG5cdFx0XHRzZXRIZWFkZXJzOiB7XG5cdFx0XHRcdEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBIZWxwZXIgZnVuY3Rpb24gd2hlbiB0aGUgcmVmcmVzaCB0b2tlbiBkb2VzbnQgd29ya1xuXHRwcml2YXRlIGxvZ291dChlcnJvcjogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHQvLyBsb2dvdXQgdXNlcnMsIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2Vcblx0XHR0aGlzLm5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZS5sb2dvdXQoKTtcblx0XHRyZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG5cdH1cblxuXHQvLyBIYW5kbGUgNDAzIGVycm9yXG5cdHByaXZhdGUgaGFuZGxlNDAzRXJyb3IoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRyZXR1cm4gdGhpcy5sb2dvdXQoZXJyb3IubWVzc2FnZSk7XG5cdH1cblxuXHQvLyBIYW5mbGUgNDAxIGVycm9yXG5cdHByaXZhdGUgaGFuZGxlNDAxRXJyb3IoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlLCByZXE6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHQvLyBAQFRPRE86IGZpbmQgYSB3YXkgdG8gY29uZmlndXJlIGl0XG5cdFx0Ly8gSWdub3JlIDQwMSBzdGF0dXMgd2hlbiB0aGUgdXJsIGFyZSBPYXV0aFxuXHRcdGlmIChyZXEudXJsLmluY2x1ZGVzKCcvb2F1dGgnKSkge1xuXHRcdFx0cmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGlmIGlzIHJlZnJlc2hpbmcgdG9rZW5cblx0XHRpZiAoIXRoaXMuaXNSZWZyZXNoaW5nVG9rZW4pIHtcblx0XHRcdHRoaXMuaXNSZWZyZXNoaW5nVG9rZW4gPSB0cnVlO1xuXG5cdFx0XHQvLyBSZXNldCBoZXJlIHNvIHRoYXQgdGhlIGZvbGxvd2luZyByZXF1ZXN0cyB3YWl0IHVudGlsIHRoZSB0b2tlblxuXHRcdFx0Ly8gY29tZXMgYmFjayBmcm9tIHRoZSByZWZyZXNoVG9rZW4gY2FsbC5cblx0XHRcdHRoaXMudG9rZW5TdWJqZWN0Lm5leHQobnVsbCk7XG5cblx0XHRcdHJldHVybiB0aGlzLm5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZS5yZWZyZXNoVG9rZW4oKVxuXHRcdFx0XHQucGlwZShcblx0XHRcdFx0XHRzd2l0Y2hNYXAoKG5ld1Rva2VuOiBOZ3hHdXN0YXZndWV6QWNjZXNzVG9rZW5Nb2RlbCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKG5ld1Rva2VuIGluc3RhbmNlb2YgTmd4R3VzdGF2Z3VlekFjY2Vzc1Rva2VuTW9kZWwpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50b2tlblN1YmplY3QubmV4dChuZXdUb2tlbi50b2tlbik7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBuZXh0LmhhbmRsZSh0aGlzLmFkZFRva2VuKHJlcSwgbmV3VG9rZW4udG9rZW4pKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSWYgd2UgZG9uJ3QgZ2V0IGEgbmV3IHRva2VuLCB3ZSBhcmUgaW4gdHJvdWJsZSBzbyBsb2dvdXQuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2dvdXQoJ0NhbnQgZ2V0IGEgbmV3IHRva2VuLicpO1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdGNhdGNoRXJyb3IoKGVycm9yQ2F0Y2hlZDogYW55KSA9PiB0aGlzLmxvZ291dChlcnJvckNhdGNoZWQubWVzc2FnZSkpLFxuXHRcdFx0XHRcdGZpbmFsaXplKCgpID0+IHRoaXMuaXNSZWZyZXNoaW5nVG9rZW4gPSBmYWxzZSlcblx0XHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBUYWtlIHRoZSB0b2tlbiBhbmQgcmVsZWFzZSByZXF1ZXN0c1xuXHRcdHJldHVybiB0aGlzLnRva2VuU3ViamVjdFxuXHRcdFx0LnBpcGUoXG5cdFx0XHRcdGZpbHRlcigodG9rZW46IGFueSkgPT4gdG9rZW4gIT09IG51bGwpLFxuXHRcdFx0XHR0YWtlKDEpLFxuXHRcdFx0XHRzd2l0Y2hNYXAoKHRva2VuOiBhbnkpID0+IG5leHQuaGFuZGxlKHRoaXMuYWRkVG9rZW4ocmVxLCB0b2tlbikpKVxuXHRcdFx0KTtcblx0fVxuXG5cdC8vIEhhbmRsZSA0MDAgZXJyb3Jcblx0cHJpdmF0ZSBoYW5kbGU0MDBFcnJvcihlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UpOiBPYnNlcnZhYmxlPGFueT4ge1xuXHRcdGlmIChlcnJvciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlXG5cdFx0XHQmJiBlcnJvci5zdGF0dXMgPT09IDQwMFxuXHRcdFx0JiYgJ2Vycm9yJyBpbiBlcnJvclxuXHRcdFx0JiYgZXJyb3IuZXJyb3IuZXJyb3IgPT09ICdpbnZhbGlkX2dyYW50Jykge1xuXHRcdFx0Ly8gSWYgd2UgZ2V0IGEgNDAwIGFuZCB0aGUgZXJyb3IgbWVzc2FnZSBpcyAnaW52YWxpZF9ncmFudCcsIHRoZSB0b2tlbiBpcyBubyBsb25nZXIgdmFsaWQgc28gbG9nb3V0LlxuXHRcdFx0cmV0dXJuIHRoaXMubG9nb3V0KGVycm9yLm1lc3NhZ2UpO1xuXHRcdH1cblxuXHRcdC8vIE5vcm1hbCBmbG93XG5cdFx0cmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuXHR9XG59XG4iXX0=