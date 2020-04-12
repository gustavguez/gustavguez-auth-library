import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormUtility } from 'ngx-gustavguez-core';
import { NgxGustavguezAuthService } from '../ngx-gustavguez-auth.service';
import { NgxGustavguezLastMeModel } from '../ngx-gustavguez-last-me.model';
let NgxGustavguezAuthLoginComponent = class NgxGustavguezAuthLoginComponent {
    // Component constructor
    constructor(ngxGustavguezAuthService, fb) {
        this.ngxGustavguezAuthService = ngxGustavguezAuthService;
        this.fb = fb;
        // Outputs
        this.onSuccess = new EventEmitter();
        this.onError = new EventEmitter();
    }
    // Events
    ngOnInit() {
        // Init loading
        this.loading = false;
        // Check last logged avatar
        if (this.ngxGustavguezAuthService.getLastMe() instanceof NgxGustavguezLastMeModel) {
            const lastMe = this.ngxGustavguezAuthService.getLastMe();
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
    }
    onSubmit() {
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
                .subscribe((result) => {
                // Stop loading
                this.loading = false;
                // Check result
                if (result) {
                    // Emit success
                    this.onSuccess.emit();
                }
            }, (error) => {
                // Stop loading
                this.loading = false;
                // Emit error
                this.onError.emit(error);
            });
        }
        else {
            // Display error
            FormUtility.validateAllFormFields(this.form);
        }
    }
    onUsernameChange() {
        // Check different
        if (this.lastUsername !== this.form.value.username) {
            this.lastAvatar = null;
        }
    }
    initForm() {
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
    }
};
NgxGustavguezAuthLoginComponent.ctorParameters = () => [
    { type: NgxGustavguezAuthService },
    { type: FormBuilder }
];
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
export { NgxGustavguezAuthLoginComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotYXV0aC1sb2dpbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLyIsInNvdXJjZXMiOlsibGliL25neC1ndXN0YXZndWV6LWF1dGgtbG9naW4vbmd4LWd1c3Rhdmd1ZXotYXV0aC1sb2dpbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHcEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBTzNFLElBQWEsK0JBQStCLEdBQTVDLE1BQWEsK0JBQStCO0lBaUIzQyx3QkFBd0I7SUFDeEIsWUFDUyx3QkFBa0QsRUFDbEQsRUFBZTtRQURmLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQWJ4QixVQUFVO1FBQ0EsY0FBUyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELFlBQU8sR0FBb0MsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQVc1QyxDQUFDO0lBRTdCLFNBQVM7SUFDVCxRQUFRO1FBQ1AsZUFBZTtRQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXJCLDJCQUEyQjtRQUMzQixJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsWUFBWSx3QkFBd0IsRUFBRTtZQUNsRixNQUFNLE1BQU0sR0FBNkIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRW5GLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUNwQztRQUVELG1CQUFtQjtRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEQsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNwRCxDQUFDLENBQUM7UUFFSCxjQUFjO1FBQ2QsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDN0MsZUFBZTtZQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsT0FBTztTQUNQO1FBRUQsZUFBZTtRQUNmLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsUUFBUTtRQUNQLGdCQUFnQjtRQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTztTQUNQO1FBRUQsZ0NBQWdDO1FBQ2hDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDcEIsY0FBYztZQUNkLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBRXBCLGtCQUFrQjtZQUNsQixJQUFJLENBQUMsd0JBQXdCO2lCQUMzQixLQUFLLENBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQ3hCO2lCQUNBLFNBQVMsQ0FDVCxDQUFDLE1BQWUsRUFBRSxFQUFFO2dCQUNuQixlQUFlO2dCQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUVyQixlQUFlO2dCQUNmLElBQUksTUFBTSxFQUFFO29CQUNYLGVBQWU7b0JBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDdEI7WUFDRixDQUFDLEVBQ0QsQ0FBQyxLQUF3QixFQUFFLEVBQUU7Z0JBQzVCLGVBQWU7Z0JBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBRXJCLGFBQWE7Z0JBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUNELENBQUM7U0FDSDthQUFNO1lBQ04sZ0JBQWdCO1lBQ2hCLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0M7SUFDRixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2Ysa0JBQWtCO1FBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDRixDQUFDO0lBRU8sUUFBUTtRQUNmLGFBQWE7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWxCLHNCQUFzQjtRQUN0QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3BCLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWTthQUMzQixDQUFDLENBQUM7U0FDSDtRQUVELGVBQWU7UUFDZixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0NBQ0QsQ0FBQTs7WUFoR21DLHdCQUF3QjtZQUM5QyxXQUFXOztBQWxCZjtJQUFSLEtBQUssRUFBRTtpRUFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7NEVBQTZCO0FBQzVCO0lBQVIsS0FBSyxFQUFFOzRFQUE2QjtBQUM1QjtJQUFSLEtBQUssRUFBRTttRUFBb0I7QUFHbEI7SUFBVCxNQUFNLEVBQUU7a0VBQW9EO0FBQ25EO0lBQVQsTUFBTSxFQUFFO2dFQUErRDtBQVQ1RCwrQkFBK0I7SUFMM0MsU0FBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLDJCQUEyQjtRQUNyQyx1cENBQXlEOztLQUV6RCxDQUFDO0dBQ1csK0JBQStCLENBbUgzQztTQW5IWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmltcG9ydCB7IEZvcm1VdGlsaXR5IH0gZnJvbSAnbmd4LWd1c3Rhdmd1ZXotY29yZSc7XG5pbXBvcnQgeyBOZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UgfSBmcm9tICcuLi9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmd4R3VzdGF2Z3Vlekxhc3RNZU1vZGVsIH0gZnJvbSAnLi4vbmd4LWd1c3Rhdmd1ZXotbGFzdC1tZS5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25neC1ndXN0YXZndWV6LWF1dGgtbG9naW4nLFxuXHR0ZW1wbGF0ZVVybDogJy4vbmd4LWd1c3Rhdmd1ZXotYXV0aC1sb2dpbi5jb21wb25lbnQuaHRtbCcsXG5cdHN0eWxlVXJsczogWycuL25neC1ndXN0YXZndWV6LWF1dGgtbG9naW4uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hHdXN0YXZndWV6QXV0aExvZ2luQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblx0Ly8gSW5wdXRzXG5cdEBJbnB1dCgpIGltYWdlVXJsOiBzdHJpbmc7XG5cdEBJbnB1dCgpIHVzZXJuYW1lUGxhY2Vob2xkZXI6IHN0cmluZztcblx0QElucHV0KCkgcGFzc3dvcmRQbGFjZWhvbGRlcjogc3RyaW5nO1xuXHRASW5wdXQoKSBzdWJtaXRUZXh0OiBzdHJpbmc7XG5cblx0Ly8gT3V0cHV0c1xuXHRAT3V0cHV0KCkgb25TdWNjZXNzOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBvbkVycm9yOiBFdmVudEVtaXR0ZXI8SHR0cEVycm9yUmVzcG9uc2U+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdC8vIFByb3BlcnRpZXNcblx0bG9hZGluZzogYm9vbGVhbjtcblx0bGFzdEF2YXRhcjogc3RyaW5nO1xuXHRsYXN0VXNlcm5hbWU6IHN0cmluZztcblx0Zm9ybTogRm9ybUdyb3VwO1xuXHRcblx0Ly8gQ29tcG9uZW50IGNvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgbmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlOiBOZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UsXG5cdFx0cHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIpIHsgfVxuXG5cdC8vIEV2ZW50c1xuXHRuZ09uSW5pdCgpOiB2b2lkIHtcblx0XHQvLyBJbml0IGxvYWRpbmdcblx0XHR0aGlzLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdC8vIENoZWNrIGxhc3QgbG9nZ2VkIGF2YXRhclxuXHRcdGlmICh0aGlzLm5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZS5nZXRMYXN0TWUoKSBpbnN0YW5jZW9mIE5neEd1c3Rhdmd1ZXpMYXN0TWVNb2RlbCkge1xuXHRcdFx0Y29uc3QgbGFzdE1lOiBOZ3hHdXN0YXZndWV6TGFzdE1lTW9kZWwgPSB0aGlzLm5neEd1c3Rhdmd1ZXpBdXRoU2VydmljZS5nZXRMYXN0TWUoKTtcblxuXHRcdFx0dGhpcy5sYXN0QXZhdGFyID0gdGhpcy5pbWFnZVVybCArIGxhc3RNZS5hdmF0YXI7XG5cdFx0XHR0aGlzLmxhc3RVc2VybmFtZSA9IGxhc3RNZS51c2VybmFtZTtcblx0XHR9XG5cblx0XHQvLyBDcmVhdGVzIHRoZSBmb3JtXG5cdFx0dGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG5cdFx0XHR1c2VybmFtZTogdGhpcy5mYi5jb250cm9sKCcnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZF0pLFxuXHRcdFx0cGFzc3dvcmQ6IHRoaXMuZmIuY29udHJvbCgnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdKVxuXHRcdH0pO1xuXG5cdFx0Ly8gQ2hlY2sgc3RhdGVcblx0XHRpZiAodGhpcy5uZ3hHdXN0YXZndWV6QXV0aFNlcnZpY2UuaXNMb2dnZWQoKSkge1xuXHRcdFx0Ly8gRW1pdCBzdWNjZXNzXG5cdFx0XHR0aGlzLm9uU3VjY2Vzcy5lbWl0KCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGFsIGNsZWFyXG5cdFx0dGhpcy5pbml0Rm9ybSgpO1xuXHR9XG5cblx0b25TdWJtaXQoKTogdm9pZCB7XG5cdFx0Ly8gQ2hlY2sgbG9hZGluZ1xuXHRcdGlmICh0aGlzLmxvYWRpbmcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBhbGx3YXlzIGZvcm0gdmFsaWRhdGlvblxuXHRcdGlmICh0aGlzLmZvcm0udmFsaWQpIHtcblx0XHRcdC8vIFNldCBsb2FkaW5nXG5cdFx0XHR0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0XHQvLyBTdWJtaXQgdGhlIGZvcm1cblx0XHRcdHRoaXMubmd4R3VzdGF2Z3VlekF1dGhTZXJ2aWNlXG5cdFx0XHRcdC5sb2dpbihcblx0XHRcdFx0XHR0aGlzLmZvcm0udmFsdWUudXNlcm5hbWUsXG5cdFx0XHRcdFx0dGhpcy5mb3JtLnZhbHVlLnBhc3N3b3JkXG5cdFx0XHRcdClcblx0XHRcdFx0LnN1YnNjcmliZShcblx0XHRcdFx0XHQocmVzdWx0OiBib29sZWFuKSA9PiB7XG5cdFx0XHRcdFx0XHQvLyBTdG9wIGxvYWRpbmdcblx0XHRcdFx0XHRcdHRoaXMubG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHQvLyBDaGVjayByZXN1bHRcblx0XHRcdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRcdFx0Ly8gRW1pdCBzdWNjZXNzXG5cdFx0XHRcdFx0XHRcdHRoaXMub25TdWNjZXNzLmVtaXQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcblx0XHRcdFx0XHRcdC8vIFN0b3AgbG9hZGluZ1xuXHRcdFx0XHRcdFx0dGhpcy5sb2FkaW5nID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdC8vIEVtaXQgZXJyb3Jcblx0XHRcdFx0XHRcdHRoaXMub25FcnJvci5lbWl0KGVycm9yKTtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRGlzcGxheSBlcnJvclxuXHRcdFx0Rm9ybVV0aWxpdHkudmFsaWRhdGVBbGxGb3JtRmllbGRzKHRoaXMuZm9ybSk7XG5cdFx0fVxuXHR9XG5cblx0b25Vc2VybmFtZUNoYW5nZSgpOiB2b2lkIHtcblx0XHQvLyBDaGVjayBkaWZmZXJlbnRcblx0XHRpZiAodGhpcy5sYXN0VXNlcm5hbWUgIT09IHRoaXMuZm9ybS52YWx1ZS51c2VybmFtZSkge1xuXHRcdFx0dGhpcy5sYXN0QXZhdGFyID0gbnVsbDtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGluaXRGb3JtKCk6IHZvaWQge1xuXHRcdC8vIENsZWFyIGZvcm1cblx0XHR0aGlzLmZvcm0ucmVzZXQoKTtcblxuXHRcdC8vIENoZWNrIGxhc3QgdXNlcm5hbWVcblx0XHRpZiAodGhpcy5sYXN0VXNlcm5hbWUpIHtcblx0XHRcdHRoaXMuZm9ybS5wYXRjaFZhbHVlKHtcblx0XHRcdFx0dXNlcm5hbWU6IHRoaXMubGFzdFVzZXJuYW1lXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBTdG9wIGxvYWRpbmdcblx0XHR0aGlzLmxvYWRpbmcgPSBmYWxzZTtcblx0fVxufVxuIl19