import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { NgxGustavguezAuthService } from './ngx-gustavguez-auth.service';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-gustavguez-auth.service";
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
NgxGustavguezAuthGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgxGustavguezAuthGuard_Factory() { return new NgxGustavguezAuthGuard(i0.ɵɵinject(i1.NgxGustavguezAuthService)); }, token: NgxGustavguezAuthGuard, providedIn: "root" });
NgxGustavguezAuthGuard = __decorate([
    Injectable({
        providedIn: 'root',
    })
], NgxGustavguezAuthGuard);
export { NgxGustavguezAuthGuard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndXN0YXZndWV6LWF1dGgvIiwic291cmNlcyI6WyJsaWIvbmd4LWd1c3Rhdmd1ZXotYXV0aC5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7O0FBS3pFLElBQWEsc0JBQXNCLEdBQW5DLE1BQWEsc0JBQXNCO0lBRWxDLFlBQ1Msd0JBQWtEO1FBQWxELDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7SUFBSSxDQUFDO0lBRWhFLFdBQVc7UUFDVix1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDN0MsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUVELHNCQUFzQjtRQUN0QixJQUFJLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0RCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7Q0FDRCxDQUFBOztZQVptQyx3QkFBd0I7OztBQUgvQyxzQkFBc0I7SUFIbEMsVUFBVSxDQUFDO1FBQ1gsVUFBVSxFQUFFLE1BQU07S0FDbEIsQ0FBQztHQUNXLHNCQUFzQixDQWVsQztTQWZZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgQ2FuQWN0aXZhdGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG5cdHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgTmd4R3VzdGF2Z3VlekF1dGhHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIG5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZTogTmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlKSB7IH1cblxuXHRjYW5BY3RpdmF0ZSgpOiBib29sZWFuIHtcblx0XHQvLyBBY3RpdmUgdXNlciBzZXNzaW9uP1xuXHRcdGlmICh0aGlzLm5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZS5pc0xvZ2dlZCgpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBSZWRpcmVjdCBsb2dpbiBmb3JtXG5cdFx0dGhpcy5uZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UuY2hlY2tBbmROb3RpZnlNZVN0YXRlKCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4iXX0=