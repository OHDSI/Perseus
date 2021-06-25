import { Component, Inject } from '@angular/core';
import { AuthDirective } from '../auth.directive';
import { authInjector } from '@services/auth/auth-injector';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { parseHttpError } from '@utils/error';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: [
    './recover-password.component.scss',
    '../auth.component.scss'
  ]
})
export class RecoverPasswordComponent extends AuthDirective {

  restored = false

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router) {
    super(authService, router)
  }

  get email() {
    return this.form.get('email')
  }

  get notRestored() {
    return !this.restored
  }

  submit(): void {
    const {email} = this.form.value
    this.sendRequestAndShowLoading(this.authService.recoverPassword(email))
      .subscribe(
        () => this.restored = true,
        error => this.error = parseHttpError(error) ?? 'Could not recover password'
      )
  }

  protected initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    })
  }
}
