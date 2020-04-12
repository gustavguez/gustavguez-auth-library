import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxGustavguezAuthService } from './ngx-gustavguez-auth.service';
export declare class NgxGustavguezAuthInterceptor implements HttpInterceptor {
    private ngxGustavguezAuthService;
    private isRefreshingToken;
    private tokenSubject;
    constructor(ngxGustavguezAuthService: NgxGustavguezAuthService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    private addToken;
    private logout;
    private handle403Error;
    private handle401Error;
    private handle400Error;
}
