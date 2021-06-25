import { Component, Inject } from '@angular/core';
import { authInjector } from '@services/auth/auth-injector';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthDirective } from '../auth.directive';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { parseHttpError } from '@utils/error';
import { nameRegex, passwordRegex } from '../auxiliary/regexes';
import { configurePasswordFormControls } from '../auxiliary/password-form-controls';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: [
    './sign-out.component.scss',
    '../auth.component.scss'
  ]
})
export class SignOutComponent extends AuthDirective {

  private accountCreated = false;

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router) {
    super(authService, router)
  }

  get email() {
    return this.form.get('email')
  }

  get firstName() {
    return this.form.get('firstName')
  }

  get lastName() {
    return this.form.get('lastName')
  }

  get password() {
    return this.form.get('password')
  }

  get confirmPassword() {
    return this.form.get('confirmPassword')
  }

  get accountNotCreated() {
    return !this.accountCreated
  }

  submit(): void {
    const user = this.form.value
    this.sendRequestAndShowLoading(this.authService.register(user))
      .subscribe(
        () => this.accountCreated = true,
        error => this.error = parseHttpError(error) ?? 'Can not register'
      )
  }

  onRegisterClick() {
    this.form.reset()
    this.accountCreated = false
  }

  protected initForm(): void {
    this.form = new FormGroup({
      firstName: new FormControl(null , [
        Validators.required,
        Validators.pattern(nameRegex)
      ]),
      lastName: new FormControl(null , [
        Validators.required,
        Validators.pattern(nameRegex)
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(passwordRegex)
      ]),
      confirmPassword: new FormControl(null)
    })

    configurePasswordFormControls(
      this.form.get('password'),
      this.form.get('confirmPassword'),
      this.ngUnsubscribe
    )
  }
}
