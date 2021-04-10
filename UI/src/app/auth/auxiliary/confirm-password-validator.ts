import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * @param password - other password input control
 */
export function confirmPasswordValidator(password: AbstractControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = control.value !== password.value
    return forbidden ? {message: 'Password mismatch'} : null
  }
}
