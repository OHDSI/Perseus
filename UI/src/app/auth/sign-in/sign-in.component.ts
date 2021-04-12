import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { authInjector } from '../../services/auth/auth-injector';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parseHttpError } from '../../services/utilites/error';
import { mainPageRouter } from '../../app.constants';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: [
    './sign-in.component.scss',
    '../auth.component.scss'
  ]
})
export class SignInComponent extends AuthComponent {

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router) {
    super(authService, router)
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
        () => this.router.navigate([mainPageRouter]),
        error => this.error = parseHttpError(error) ?? 'Incorrect login or password'
      )
  }

  protected initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }
}
