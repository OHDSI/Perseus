import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

export abstract class TransformationFunction<T> {
  private readonly formGroup: FormGroup

  constructor() {
    this.formGroup = this.createForm()
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

  protected abstract createForm(): FormGroup
}
