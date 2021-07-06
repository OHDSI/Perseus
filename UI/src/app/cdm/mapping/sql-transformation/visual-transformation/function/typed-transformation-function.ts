import { fieldTypeValidator } from '@app/utils/field-type';
import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { ValidationService } from '@services/validation.service';

export abstract class TypedTransformationFunction<T> extends TransformationFunction<T> {

  protected abstract validationService: ValidationService

  get fieldType() {
    return this.type || 'string'
  }

  protected get fieldTypeValidator() {
    return fieldTypeValidator(this.validationService, this.fieldType)
  }

  protected getValueShaper(): (value: string | number) => string {
    switch (this.type) {
      case 'string':
        return (value: string) => `'${value}'`
      case 'integer':
        return (value: number) => `${value}`
      case 'date':
      case 'datetime':
      case 'time':
        return (value: string) => value
      default: // Other types handle as char
        return (value: string) => `'${value}'`
    }
  }
}
