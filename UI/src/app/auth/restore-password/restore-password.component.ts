import { Component, Inject } from '@angular/core';
import { AuthComponent } from '../auth.component';
import { authInjector } from '../../services/auth/auth-injector';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { parseHttpError } from '../../services/utilites/error';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: [
    './restore-password.component.scss',
    '../auth.component.scss'
  ]
})
export class RestorePasswordComponent extends AuthComponent {

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
    this.sendRequestAndShowLoading(this.authService.restorePassword(email))
      .subscribe(
        () => this.restored = true,
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
      email: new FormControl(null, [Validators.required, Validators.email])
    })
  }
}
