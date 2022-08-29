import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { authInjector } from '@services/auth/auth-injector';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parseHttpError } from '@utils/error';
import { isAzureAuth, mainPageRouter } from '@app/app.constants';
import { AuthComponent } from '../auth.component';
import { AuthGuard } from '@guards/auth/auth.guard'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [
    './sign-in.component.scss',
    '../auth.component.scss'
  ]
})
export class SignInComponent extends AuthComponent implements OnInit {
  isAzureAuth = isAzureAuth

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router,
              private authGuard: AuthGuard) {
    super(authService, router)
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.isAzureAuth && this.authService.firstLogin) {
      this.submit()
    }

    this.authGuard.errorMessage$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(error => this.error = error)
  }

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  get errorTop() {
    return this.isAzureAuth ? '143px' : '267px'
  }

  submit() {
    const {email, password} = this.form.value
    this.sendRequestAndShowLoading(this.authService.login(email, password))
      .subscribe(
        result => result && this.router.navigate([mainPageRouter]),
        error => this.error = parseHttpError(error) ?? 'Auth failed'
      )
  }

  protected initForm() {
    if (this.isAzureAuth) {
      this.form = new FormGroup({});
    } else {
      this.form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required])
      })
    }
  }
}
