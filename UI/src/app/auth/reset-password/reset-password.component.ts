import { Component, Inject } from '@angular/core';
import { AuthComponent } from '../auth.component';
import { authInjector } from '../../services/auth/auth-injector';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordRegex } from '../auxiliary/regexes';
import { parseHttpError } from '../../services/utilites/error';
import { configurePasswordFormControls } from '../auxiliary/password-form-controls';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    '../auth.component.scss'
  ]
})
export class ResetPasswordComponent extends AuthComponent {

  private reset = false;

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router) {
    super(authService, router)
  }

  get password() {
    return this.form.get('password')
  }

  get confirmPassword() {
    return this.form.get('confirmPassword')
  }

  get notReset() {
    return !this.reset
  }

  submit(): void {
    const {password} = this.form.value
    this.sendRequestAndShowLoading(this.authService.reset(password))
      .subscribe(
        () => this.reset = true,
        error => {
          if (error.status === 0 || error.status >= 500) {
            // todo handling server error
          } else {
            this.error = parseHttpError(error) ?? 'Could not restore password'
          }
        }
      )
  }

  protected initForm(): void {
    this.form = new FormGroup({
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
