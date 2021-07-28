import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { FieldType } from '@utils/field-type';

export abstract class TransformationFunction<T> {
  protected readonly formGroup: FormGroup

  constructor(value?: T, protected readonly type?: FieldType) {
    this.formGroup = this.createForm()
    if (value) {
      this.formGroup.setValue(value)
    }
  }

  get form(): FormGroup {
    return this.formGroup
  }

  get valid(): boolean {
    return this.formGroup.valid
  }

  get change$(): Observable<T> {
    return this.formGroup.valueChanges
  }

  set value(value: T) {
    this.formGroup.setValue(value)
  }

  get value(): T {
    return this.formGroup.value
  }

  get touched(): boolean {
    return this.formGroup.touched
  }

  get dirty(): boolean {
    return this.formGroup.dirty
  }

  /**
   * @return function with one argument which this sql func applied that return sql expression
   */
  abstract sql(): (arg: string) => string

  /**
   * @return form for sql function arguments
   */
  protected abstract createForm(): FormGroup
}
