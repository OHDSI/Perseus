import { AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { confirmPasswordValidator } from './confirm-password-validator';
import { takeUntil } from 'rxjs/operators';

export function configurePasswordFormControls(password: AbstractControl,
                                              confirmPassword: AbstractControl,
                                              ngUnsubscribe?: Observable<any>): Observable<any> {
  confirmPassword.setValidators([
    Validators.required,
    confirmPasswordValidator(password)
  ])

  const passwordChange$ = ngUnsubscribe ?
    password.valueChanges.pipe(takeUntil(ngUnsubscribe)) :
    password.valueChanges

  passwordChange$
    .subscribe(() => confirmPassword.updateValueAndValidity())

  return passwordChange$
}
