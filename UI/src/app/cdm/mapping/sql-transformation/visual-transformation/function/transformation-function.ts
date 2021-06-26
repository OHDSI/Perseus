import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export abstract class TransformationFunction<T> {
  private readonly formGroup: FormGroup

  constructor(value?: T) {
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

  abstract sql(): (arg: string) => string

  protected abstract createForm(): FormGroup
}
