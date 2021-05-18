import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AuthComponent } from '../auth.component';
import { authInjector } from '../../services/auth/auth-injector';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordRegex } from '../auxiliary/regexes';
import { parseHttpError } from '../../utilites/error';
import { configurePasswordFormControls } from '../auxiliary/password-form-controls';
import { AuthStateService } from '../../services/auth/auth-state.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    '../auth.component.scss'
  ]
})
export class ResetPasswordComponent extends AuthComponent implements OnInit, OnDestroy {

  private reset = false;

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router,
              private route: ActivatedRoute,
              private authStateService: AuthStateService) {
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
        this.authStateService.state = params['token']
        this.router.navigate([])
      })
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.authStateService.state = null
  }

  submit(): void {
    const {password} = this.form.value
    this.sendRequestAndShowLoading(this.authService.reset(password, this.authStateService.state))
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
