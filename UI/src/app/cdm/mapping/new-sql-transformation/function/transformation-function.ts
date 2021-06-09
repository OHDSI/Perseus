import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

export abstract class TransformationFunction<T> {
  private readonly formGroup: FormGroup

  protected constructor() {
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

  abstract createForm(): FormGroup

  abstract sql(): (arg: string) => string
}
