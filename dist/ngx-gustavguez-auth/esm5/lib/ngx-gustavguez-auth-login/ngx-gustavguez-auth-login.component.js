import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormUtility } from 'ngx-gustavguez-core';
import { NgxGustavguezAuthService } from '../ngx-gustavguez-auth.service';
import { NgxGustavguezLastMeModel } from '../ngx-gustavguez-last-me.model';
var NgxGustavguezAuthLoginComponent = /** @class */ (function () {
    // Component constructor
    function NgxGustavguezAuthLoginComponent(ngxGustavguezAuthService, fb) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
        this.fb = fb;
        // Outputs
        this.onSuccess = new EventEmitter();
        this.onError = new EventEmitter();
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
            FormUtility.validateAllFormFields(this.form);
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
        { type: FormBuilder }
    ]; };
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
    return NgxGustavguezAuthLoginComponent;
}());
export { NgxGustavguezAuthLoginComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC1sb2dpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLyIsInNvdXJjZXMiOlsibGliL25neC1ndXN0YXZndWV6LWF1dGgtbG9naW4vbmd4LWd1c3Rhdmd1ZXotYXV0aC1sb2dpbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHcEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBTzNFO0lBaUJDLHdCQUF3QjtJQUN4Qix5Q0FDUyx3QkFBa0QsRUFDbEQsRUFBZTtRQURmLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQWJ4QixVQUFVO1FBQ0EsY0FBUyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELFlBQU8sR0FBb0MsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQVc1QyxDQUFDO0lBRTdCLFNBQVM7SUFDVCxrREFBUSxHQUFSO1FBQ0MsZUFBZTtRQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXJCLDJCQUEyQjtRQUMzQixJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsWUFBWSx3QkFBd0IsRUFBRTtZQUNsRixJQUFNLE1BQU0sR0FBNkIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRW5GLElBQUksQ0FBQyxVQUFV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QUssRUFBRTt1RUFBb0I7SUFHbEI7UUFBVCxNQUFNLEVBQUU7c0VBQW9EO0lBQ25EO1FBQVQsTUFBTSxFQUFFO29FQUErRDtJQVQ1RCwrQkFBK0I7UUFMM0MsU0FBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLDJCQUEyQjtZQUNyQyx1cENBQXlEOztTQUV6RCxDQUFDO09BQ1csK0JBQStCLENBbUgzQztJQUFELHNDQUFDO0NBQUEsQUFuSEQsSUFtSEM7U0FuSFksK0JBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQgeyBGb3JtVXRpbGl0eSB9IGZyb20gJ25neC1ndXN0YXZndWV6LWNvcmUnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vbmd4LWd1c3Rhdmd1ZXotYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCB9IGZyb20gJy4uL25neC1ndXN0YXZndWV6LWxhc3QtbWUubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICduZ3gtZ3VzdGF2Z3Vlei1hdXRoLWxvZ2luJyxcblx0dGVtcGxhdGVVcmw6ICcuL25neC1ndXN0YXZndWV6LWF1dGgtbG9naW4uY29tcG9uZW50Lmh0bWwnLFxuXHRzdHlsZVVybHM6IFsnLi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLWxvZ2luLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmd4R3VzdGF2Z3VlekF1dGhMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cdC8vIElucHV0c1xuXHRASW5wdXQoKSBpbWFnZVVybDogc3RyaW5nO1xuXHRASW5wdXQoKSB1c2VybmFtZVBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cdEBJbnB1dCgpIHBhc3N3b3JkUGxhY2Vob2xkZXI6IHN0cmluZztcblx0QElucHV0KCkgc3VibWl0VGV4dDogc3RyaW5nO1xuXG5cdC8vIE91dHB1dHNcblx0QE91dHB1dCgpIG9uU3VjY2VzczogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgb25FcnJvcjogRXZlbnRFbWl0dGVyPEh0dHBFcnJvclJlc3BvbnNlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHQvLyBQcm9wZXJ0aWVzXG5cdGxvYWRpbmc6IGJvb2xlYW47XG5cdGxhc3RBdmF0YXI6IHN0cmluZztcblx0bGFzdFVzZXJuYW1lOiBzdHJpbmc7XG5cdGZvcm06IEZvcm1Hcm91cDtcblx0XG5cdC8vIENvbXBvbmVudCBjb25zdHJ1Y3RvclxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIG5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZTogTmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlLFxuXHRcdHByaXZhdGUgZmI6IEZvcm1CdWlsZGVyKSB7IH1cblxuXHQvLyBFdmVudHNcblx0bmdPbkluaXQoKTogdm9pZCB7XG5cdFx0Ly8gSW5pdCBsb2FkaW5nXG5cdFx0dGhpcy5sb2FkaW5nID0gZmFsc2U7XG5cblx0XHQvLyBDaGVjayBsYXN0IGxvZ2dlZCBhdmF0YXJcblx0XHRpZiAodGhpcy5uZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UuZ2V0TGFzdE1lKCkgaW5zdGFuY2VvZiBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwpIHtcblx0XHRcdGNvbnN0IGxhc3RNZTogTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsID0gdGhpcy5uZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UuZ2V0TGFzdE1lKCk7XG5cblx0XHRcdHRoaXMubGFzdEF2YXRhciA9IHRoaXMuaW1hZ2VVcmwgKyBsYXN0TWUuYXZhdGFyO1xuXHRcdFx0dGhpcy5sYXN0VXNlcm5hbWUgPSBsYXN0TWUudXNlcm5hbWU7XG5cdFx0fVxuXG5cdFx0Ly8gQ3JlYXRlcyB0aGUgZm9ybVxuXHRcdHRoaXMuZm9ybSA9IHRoaXMuZmIuZ3JvdXAoe1xuXHRcdFx0dXNlcm5hbWU6IHRoaXMuZmIuY29udHJvbCgnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdKSxcblx0XHRcdHBhc3N3b3JkOiB0aGlzLmZiLmNvbnRyb2woJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXSlcblx0XHR9KTtcblxuXHRcdC8vIENoZWNrIHN0YXRlXG5cdFx0aWYgKHRoaXMubmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlLmlzTG9nZ2VkKCkpIHtcblx0XHRcdC8vIEVtaXQgc3VjY2Vzc1xuXHRcdFx0dGhpcy5vblN1Y2Nlc3MuZW1pdCgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEluaXRhbCBjbGVhclxuXHRcdHRoaXMuaW5pdEZvcm0oKTtcblx0fVxuXG5cdG9uU3VibWl0KCk6IHZvaWQge1xuXHRcdC8vIENoZWNrIGxvYWRpbmdcblx0XHRpZiAodGhpcy5sb2FkaW5nKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgYWxsd2F5cyBmb3JtIHZhbGlkYXRpb25cblx0XHRpZiAodGhpcy5mb3JtLnZhbGlkKSB7XG5cdFx0XHQvLyBTZXQgbG9hZGluZ1xuXHRcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdFx0Ly8gU3VibWl0IHRoZSBmb3JtXG5cdFx0XHR0aGlzLm5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZVxuXHRcdFx0XHQubG9naW4oXG5cdFx0XHRcdFx0dGhpcy5mb3JtLnZhbHVlLnVzZXJuYW1lLFxuXHRcdFx0XHRcdHRoaXMuZm9ybS52YWx1ZS5wYXNzd29yZFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5zdWJzY3JpYmUoXG5cdFx0XHRcdFx0KHJlc3VsdDogYm9vbGVhbikgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gU3RvcCBsb2FkaW5nXG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0Ly8gQ2hlY2sgcmVzdWx0XG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRcdC8vIEVtaXQgc3VjY2Vzc1xuXHRcdFx0XHRcdFx0XHR0aGlzLm9uU3VjY2Vzcy5lbWl0KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyBTdG9wIGxvYWRpbmdcblx0XHRcdFx0XHRcdHRoaXMubG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHQvLyBFbWl0IGVycm9yXG5cdFx0XHRcdFx0XHR0aGlzLm9uRXJyb3IuZW1pdChlcnJvcik7XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIERpc3BsYXkgZXJyb3Jcblx0XHRcdEZvcm1VdGlsaXR5LnZhbGlkYXRlQWxsRm9ybUZpZWxkcyh0aGlzLmZvcm0pO1xuXHRcdH1cblx0fVxuXG5cdG9uVXNlcm5hbWVDaGFuZ2UoKTogdm9pZCB7XG5cdFx0Ly8gQ2hlY2sgZGlmZmVyZW50XG5cdFx0aWYgKHRoaXMubGFzdFVzZXJuYW1lICE9PSB0aGlzLmZvcm0udmFsdWUudXNlcm5hbWUpIHtcblx0XHRcdHRoaXMubGFzdEF2YXRhciA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBpbml0Rm9ybSgpOiB2b2lkIHtcblx0XHQvLyBDbGVhciBmb3JtXG5cdFx0dGhpcy5mb3JtLnJlc2V0KCk7XG5cblx0XHQvLyBDaGVjayBsYXN0IHVzZXJuYW1lXG5cdFx0aWYgKHRoaXMubGFzdFVzZXJuYW1lKSB7XG5cdFx0XHR0aGlzLmZvcm0ucGF0Y2hWYWx1ZSh7XG5cdFx0XHRcdHVzZXJuYW1lOiB0aGlzLmxhc3RVc2VybmFtZVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gU3RvcCBsb2FkaW5nXG5cdFx0dGhpcy5sb2FkaW5nID0gZmFsc2U7XG5cdH1cbn1cbiJdfQ==