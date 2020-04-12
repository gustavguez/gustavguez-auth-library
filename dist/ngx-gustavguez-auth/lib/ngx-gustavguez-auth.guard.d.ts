import { CanActivate } from '@angular/router';
import { NgxGustavguezAuthService } from './ngx-gustavguez-auth.service';
export declare class NgxGustavguezAuthGuard implements CanActivate {
    private ngxGustavguezAuthService;
    constructor(ngxGustavguezAuthService: NgxGustavguezAuthService);
    canActivate(): boolean;
}
