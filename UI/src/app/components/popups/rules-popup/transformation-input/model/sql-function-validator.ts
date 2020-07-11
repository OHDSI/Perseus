import { ValidatorFn, AbstractControl } from '@angular/forms';
import { isString } from 'util';
import { SqlFunction } from './sql-string-functions';

export function sqlParametersValidator(parametersRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (isString(control.value)) {
      const ok = parametersRe.test(control.value);
      if (!ok) {
        return { parameters: { value: control.value } };
      }

      const { value } = control;
      const parametersParsed = value.match(parametersRe);

      if (parametersParsed && parametersParsed.length > 1) {
        const parameters = parametersParsed[1].split(',');

        if (parameters.length === control["criteria"].parameters.length) {
          return null;
        } else {
          return { parameters: { value: control.value } };
        }
      } else {
        return { parameters: { value: control.value } };
      }
    }
  };
}
