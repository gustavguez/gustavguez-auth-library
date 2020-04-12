import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { FormUtility } from 'ngx-gustavguez-core';
import { NgxGustavguezAuthService } from '../ngx-gustavguez-auth.service';
import { NgxGustavguezLastMeModel } from '../ngx-gustavguez-last-me.model';

@Component({
	selector: 'ngx-gustavguez-auth-login',
	templateUrl: './ngx-gustavguez-auth-login.component.html',
	styleUrls: ['./ngx-gustavguez-auth-login.component.scss']
})
export class NgxGustavguezAuthLoginComponent implements OnInit {
	// Inputs
	@Input() imageUrl: string;
	@Input() usernamePlaceholder: string;
	@Input() passwordPlaceholder: string;
	@Input() submitText: string;

	// Outputs
	@Output() onSuccess: EventEmitter<void> = new EventEmitter();
	@Output() onError: EventEmitter<HttpErrorResponse> = new EventEmitter();

	// Properties
	loading: boolean;
	lastAvatar: string;
	lastUsername: string;
	form: FormGroup;
	
	// Component constructor
	constructor(
		private ngxGustavguezAuthService: NgxGustavguezAuthService,
		private fb: FormBuilder) { }

	// Events
	ngOnInit(): void {
		// Init loading
		this.loading = false;

		// Check last logged avatar
		if (this.ngxGustavguezAuthService.getLastMe() instanceof NgxGustavguezLastMeModel) {
			const lastMe: NgxGustavguezLastMeModel = this.ngxGustavguezAuthService.getLastMe();

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

	onSubmit(): void {
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
				.login(
					this.form.value.username,
					this.form.value.password
				)
				.subscribe(
					(result: boolean) => {
						// Stop loading
						this.loading = false;

						// Check result
						if (result) {
							// Emit success
							this.onSuccess.emit();
						}
					},
					(error: HttpErrorResponse) => {
						// Stop loading
						this.loading = false;

						// Emit error
						this.onError.emit(error);							
					}
				);
		} else {
			// Display error
			FormUtility.validateAllFormFields(this.form);
		}
	}

	onUsernameChange(): void {
		// Check different
		if (this.lastUsername !== this.form.value.username) {
			this.lastAvatar = null;
		}
	}

	private initForm(): void {
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
}
