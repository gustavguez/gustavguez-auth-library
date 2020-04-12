import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { NgxGustavguezCoreModule } from 'ngx-gustavguez-core';
import { NgxGustavguezAuthInterceptor } from './ngx-gustavguez-auth.interceptor';
import { NgxGustavguezAuthLoginComponent } from './ngx-gustavguez-auth-login/ngx-gustavguez-auth-login.component';
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
export { NgxGustavguezAuthModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLyIsInNvdXJjZXMiOlsibGliL25neC1ndXN0YXZndWV6LWF1dGgubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNqRixPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxpRUFBaUUsQ0FBQztBQW1CbEg7SUFBQTtJQUF1QyxDQUFDO0lBQTNCLHVCQUF1QjtRQWpCbkMsUUFBUSxDQUFDO1lBQ1QsWUFBWSxFQUFFLENBQUMsK0JBQStCLENBQUM7WUFDL0MsT0FBTyxFQUFFO2dCQUNSLFlBQVk7Z0JBQ1osa0JBQWtCO2dCQUNsQixtQkFBbUI7Z0JBQ25CLHVCQUF1QjthQUN2QjtZQUNELFNBQVMsRUFBRTtnQkFDVjtvQkFDQyxPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxLQUFLLEVBQUUsSUFBSTtpQkFDWDthQUNEO1lBQ0QsT0FBTyxFQUFFLENBQUMsK0JBQStCLENBQUM7U0FDMUMsQ0FBQztPQUNXLHVCQUF1QixDQUFJO0lBQUQsOEJBQUM7Q0FBQSxBQUF4QyxJQUF3QztTQUEzQix1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEhUVFBfSU5URVJDRVBUT1JTIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZU1vZHVsZSB9IGZyb20gJ2FuZ3VsYXItMi1sb2NhbC1zdG9yYWdlJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpDb3JlTW9kdWxlIH0gZnJvbSAnbmd4LWd1c3Rhdmd1ZXotY29yZSc7XG5cbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpBdXRoSW50ZXJjZXB0b3IgfSBmcm9tICcuL25neC1ndXN0YXZndWV6LWF1dGguaW50ZXJjZXB0b3InO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekF1dGhMb2dpbkNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotYXV0aC1sb2dpbi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLWxvZ2luLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG5cdGRlY2xhcmF0aW9uczogW05neEd1c3Rhdmd1ZXpBdXRoTG9naW5Db21wb25lbnRdLFxuXHRpbXBvcnRzOiBbXG5cdFx0Q29tbW9uTW9kdWxlLFxuXHRcdExvY2FsU3RvcmFnZU1vZHVsZSxcblx0XHRSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuXHRcdE5neEd1c3Rhdmd1ZXpDb3JlTW9kdWxlXG5cdF0sXG5cdHByb3ZpZGVyczogW1xuXHRcdHtcblx0XHRcdHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxuXHRcdFx0dXNlQ2xhc3M6IE5neEd1c3Rhdmd1ZXpBdXRoSW50ZXJjZXB0b3IsXG5cdFx0XHRtdWx0aTogdHJ1ZVxuXHRcdH1cblx0XSxcblx0ZXhwb3J0czogW05neEd1c3Rhdmd1ZXpBdXRoTG9naW5Db21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neEd1c3Rhdmd1ZXpBdXRoTW9kdWxlIHsgfVxuIl19