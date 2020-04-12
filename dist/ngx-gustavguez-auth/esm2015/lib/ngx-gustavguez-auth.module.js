import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { NgxGustavguezCoreModule } from 'ngx-gustavguez-core';
import { NgxGustavguezAuthInterceptor } from './ngx-gustavguez-auth.interceptor';
import { NgxGustavguezAuthLoginComponent } from './ngx-gustavguez-auth-login/ngx-gustavguez-auth-login.component';
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
export { NgxGustavguezAuthModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLyIsInNvdXJjZXMiOlsibGliL25neC1ndXN0YXZndWV6LWF1dGgubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNqRixPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxpRUFBaUUsQ0FBQztBQW1CbEgsSUFBYSx1QkFBdUIsR0FBcEMsTUFBYSx1QkFBdUI7Q0FBSSxDQUFBO0FBQTNCLHVCQUF1QjtJQWpCbkMsUUFBUSxDQUFDO1FBQ1QsWUFBWSxFQUFFLENBQUMsK0JBQStCLENBQUM7UUFDL0MsT0FBTyxFQUFFO1lBQ1IsWUFBWTtZQUNaLGtCQUFrQjtZQUNsQixtQkFBbUI7WUFDbkIsdUJBQXVCO1NBQ3ZCO1FBQ0QsU0FBUyxFQUFFO1lBQ1Y7Z0JBQ0MsT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsS0FBSyxFQUFFLElBQUk7YUFDWDtTQUNEO1FBQ0QsT0FBTyxFQUFFLENBQUMsK0JBQStCLENBQUM7S0FDMUMsQ0FBQztHQUNXLHVCQUF1QixDQUFJO1NBQTNCLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSFRUUF9JTlRFUkNFUFRPUlMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlTW9kdWxlIH0gZnJvbSAnYW5ndWxhci0yLWxvY2FsLXN0b3JhZ2UnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekNvcmVNb2R1bGUgfSBmcm9tICduZ3gtZ3VzdGF2Z3Vlei1jb3JlJztcblxuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekF1dGhJbnRlcmNlcHRvciB9IGZyb20gJy4vbmd4LWd1c3Rhdmd1ZXotYXV0aC5pbnRlcmNlcHRvcic7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6QXV0aExvZ2luQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLWxvZ2luL25neC1ndXN0YXZndWV6LWF1dGgtbG9naW4uY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcblx0ZGVjbGFyYXRpb25zOiBbTmd4R3VzdGF2Z3VlekF1dGhMb2dpbkNvbXBvbmVudF0sXG5cdGltcG9ydHM6IFtcblx0XHRDb21tb25Nb2R1bGUsXG5cdFx0TG9jYWxTdG9yYWdlTW9kdWxlLFxuXHRcdFJlYWN0aXZlRm9ybXNNb2R1bGUsXG5cdFx0Tmd4R3VzdGF2Z3VlekNvcmVNb2R1bGVcblx0XSxcblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXG5cdFx0XHR1c2VDbGFzczogTmd4R3VzdGF2Z3VlekF1dGhJbnRlcmNlcHRvcixcblx0XHRcdG11bHRpOiB0cnVlXG5cdFx0fVxuXHRdLFxuXHRleHBvcnRzOiBbTmd4R3VzdGF2Z3VlekF1dGhMb2dpbkNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4R3VzdGF2Z3VlekF1dGhNb2R1bGUgeyB9XG4iXX0=