import { Component, Inject } from '@angular/core';
import { authInjector } from '../../services/auth/auth-injector';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthComponent } from '../auth.component';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

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

  submit(): void {
  }

  protected initForm(): void {
    const nameValidator = Validators.pattern(/[A-Za-z]+/)

    this.form = new FormGroup({
      firstName: new FormControl(null , [
        Validators.required,
        nameValidator
      ]),
      lastName: new FormControl(null , [
        Validators.required,
        nameValidator
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&]{8,16}$/)
      ]),
      confirmPassword: new FormControl(null)
    })

    // Setting validators after the form created
    this.form.get('confirmPassword').setValidators([
      Validators.required,
      confirmPasswordValidator(this.form.get('password'))
    ])
  }
}

function confirmPasswordValidator(password: AbstractControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = control.value !== password.value
    return forbidden ? {message: 'Password mismatch'} : null
  }
}
