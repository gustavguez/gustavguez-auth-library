import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { NgxGustavguezAuthService } from './ngx-gustavguez-auth.service';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-gustavguez-auth.service";
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
    NgxGustavguezAuthGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgxGustavguezAuthGuard_Factory() { return new NgxGustavguezAuthGuard(i0.ɵɵinject(i1.NgxGustavguezAuthService)); }, token: NgxGustavguezAuthGuard, providedIn: "root" });
    NgxGustavguezAuthGuard = __decorate([
        Injectable({
            providedIn: 'root',
        })
    ], NgxGustavguezAuthGuard);
    return NgxGustavguezAuthGuard;
}());
export { NgxGustavguezAuthGuard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndXN0YXZndWV6LWF1dGgvIiwic291cmNlcyI6WyJsaWIvbmd4LWd1c3Rhdmd1ZXotYXV0aC5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7O0FBS3pFO0lBRUMsZ0NBQ1Msd0JBQWtEO1FBQWxELDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7SUFBSSxDQUFDO0lBRWhFLDRDQUFXLEdBQVg7UUFDQyx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDN0MsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUVELHNCQUFzQjtRQUN0QixJQUFJLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0RCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7O2dCQVhrQyx3QkFBd0I7OztJQUgvQyxzQkFBc0I7UUFIbEMsVUFBVSxDQUFDO1lBQ1gsVUFBVSxFQUFFLE1BQU07U0FDbEIsQ0FBQztPQUNXLHNCQUFzQixDQWVsQztpQ0F2QkQ7Q0F1QkMsQUFmRCxJQWVDO1NBZlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBDYW5BY3RpdmF0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWF1dGguc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcblx0cHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHdXN0YXZndWV6QXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgbmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlOiBOZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UpIHsgfVxuXG5cdGNhbkFjdGl2YXRlKCk6IGJvb2xlYW4ge1xuXHRcdC8vIEFjdGl2ZSB1c2VyIHNlc3Npb24/XG5cdFx0aWYgKHRoaXMubmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlLmlzTG9nZ2VkKCkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIFJlZGlyZWN0IGxvZ2luIGZvcm1cblx0XHR0aGlzLm5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZS5jaGVja0FuZE5vdGlmeU1lU3RhdGUoKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbiJdfQ==