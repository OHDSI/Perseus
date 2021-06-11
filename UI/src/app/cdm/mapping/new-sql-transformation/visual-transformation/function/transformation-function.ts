import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

export abstract class TransformationFunction<T> {
  private readonly formGroup: FormGroup

  constructor(value?: T) {
    this.formGroup = this.createForm(value)
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

  abstract sql(): (arg: string) => string

  protected abstract createForm(value?: T): FormGroup
}
