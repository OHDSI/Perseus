import { Component, Inject, OnInit } from '@angular/core';
import { AuthComponent } from '../auth.component';
import { authInjector } from '../../services/auth/auth-injector';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordRegex } from '../auxiliary/regexes';
import { parseHttpError } from '../../services/utilites/error';
import { configurePasswordFormControls } from '../auxiliary/password-form-controls';
import { ResetPasswordTokenService } from '../reset-password-token.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    '../auth.component.scss'
  ]
})
export class ResetPasswordComponent extends AuthComponent implements OnInit {

  private reset = false;

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router,
              private route: ActivatedRoute,
              private resetPasswordTokenService: ResetPasswordTokenService) {
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

  ngOnInit() {
    super.ngOnInit()
    this.route.queryParams
      .pipe(
        filter(params => !!params['token'])
      )
      .subscribe(params => {
        this.resetPasswordTokenService.token = params['token']
        this.router.navigate([])
      })
  }

  submit(): void {
    const {password} = this.form.value
    this.sendRequestAndShowLoading(this.authService.reset(password, this.resetPasswordTokenService.token))
      .subscribe(
        () => this.reset = true,
        error => this.error = parseHttpError(error) ?? 'Could not reset password'
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
