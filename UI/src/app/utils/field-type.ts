import { ValidationService } from '@services/validation.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export type FieldType = 'integer' | 'string' | 'boolean' | 'date' | 'datetime' | 'time'

export function fieldTypeValidator(service: ValidationService,
                                   type: string): (control: AbstractControl) => ValidationErrors | null {
  return control => {
    const value = `${control.value}`
    const result = service.validateInput(type, value)
    if (result) {
      return {[type]: result}
    }
    return null
  }
}
