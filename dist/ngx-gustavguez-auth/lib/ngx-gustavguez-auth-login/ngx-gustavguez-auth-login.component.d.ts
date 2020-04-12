import { OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxGustavguezAuthService } from '../ngx-gustavguez-auth.service';
export declare class NgxGustavguezAuthLoginComponent implements OnInit {
    private ngxGustavguezAuthService;
    private fb;
    imageUrl: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    submitText: string;
    onSuccess: EventEmitter<void>;
    onError: EventEmitter<HttpErrorResponse>;
    loading: boolean;
    lastAvatar: string;
    lastUsername: string;
    form: FormGroup;
    constructor(ngxGustavguezAuthService: NgxGustavguezAuthService, fb: FormBuilder);
    ngOnInit(): void;
    onSubmit(): void;
    onUsernameChange(): void;
    private initForm;
}
