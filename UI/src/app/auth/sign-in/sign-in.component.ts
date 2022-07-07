import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { authInjector } from '@services/auth/auth-injector';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parseHttpError } from '@utils/error';
import { isAddAuth, mainPageRouter } from '@app/app.constants';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [
    './sign-in.component.scss',
    '../auth.component.scss'
  ]
})
export class SignInComponent extends AuthComponent implements OnInit {
  isAddAuth = isAddAuth

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router) {
    super(authService, router)
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.isAddAuth) {
      this.submit()
    }
  }

  get email() {
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  submit() {
    const {email, password} = this.form.value
    this.sendRequestAndShowLoading(this.authService.login(email, password))
      .subscribe(
        result => result && this.router.navigate([mainPageRouter]),
        error => this.error = parseHttpError(error) ?? 'Incorrect login or password'
      )
  }

  protected initForm() {
    if (this.isAddAuth) {
      this.form = new FormGroup({});
    } else {
      this.form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required])
      })
    }
  }
}
