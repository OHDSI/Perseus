import { Component, Inject } from '@angular/core';
import { authInjector } from '../../services/auth/auth-injector';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthComponent } from '../auth.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: [
    './sign-out.component.scss',
    '../auth.component.scss'
  ]
})
export class SignOutComponent extends AuthComponent {

  constructor(@Inject(authInjector) authService: AuthService,
              router: Router) {
    super(authService, router)
  }

  get email() {
    return this.form.get('email')
  }

  submit(): void {
  }

  protected initForm(): void {
    this.form = new FormGroup({
      firstName: new FormControl(null , [Validators.required]),
      lastName: new FormControl(null , [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    })
  }
}
