import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldType } from '@utils/field-type';
import { ValidationService } from '@services/validation.service';
import { TypedTransformationFunction } from '@mapping/transform-config/sql-transformation/visual-transformation/function/typed-transformation-function';

export interface ReplaceModel {
  old: string | number
  new: string | number
}

export class ReplaceTransformationFunction extends TypedTransformationFunction<ReplaceModel> {

  protected validationService: ValidationService

  constructor(value?: ReplaceModel, type?: FieldType) {
    super(value, type);
  }

  get fieldType(): FieldType {
    return this.type || 'string'
  }

  private get old(): string {
    return this.form.get('old').value
  }

  private get new(): string {
    return this.form.get('new').value
  }

  sql(): (arg: string) => string {
    const shaper = this.getValueShaper()
    return arg => `REPLACE(${arg}, ${shaper(this.old)}, ${shaper(this.new)})`
  }

  protected createForm(): FormGroup {
    this.validationService = new ValidationService()
    return new FormGroup({
      old: new FormControl(this.getDefaultValue(), [Validators.required, this.fieldTypeValidator]),
      new: new FormControl(this.getDefaultValue(), [Validators.required, this.fieldTypeValidator])
    });
  }
}
