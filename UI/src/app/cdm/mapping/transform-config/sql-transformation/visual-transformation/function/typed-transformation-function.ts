import { fieldTypeValidator } from '@utils/field-type';
import { TransformationFunction } from '@mapping/transform-config/sql-transformation/visual-transformation/function/transformation-function';
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
        return (value: string) => `'${value}'`
      default: // Other types handle as string
        return (value: string) => `'${value}'`
    }
  }

  protected getDefaultValue(): any {
    switch (this.type) {
      case 'string':
        return 'default'
      case 'integer':
      case 'float':
        return 0
      case 'date':
        return '2021-01-01'
      case 'datetime':
        return '2021-01-01 00:00:00'
      case 'time':
        return '00:00:00'
      default:
        return 'default'
    }
  }
}
