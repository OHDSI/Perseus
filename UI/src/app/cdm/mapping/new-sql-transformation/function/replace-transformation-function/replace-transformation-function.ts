import { TransformationFunction } from '@mapping/new-sql-transformation/function/transformation-function';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ReplaceModel {
  old: string
  new: string
}

export class ReplaceTransformationFunction extends TransformationFunction<ReplaceModel> {

  constructor() {
    super();
  }

  get old(): string {
    return this.form.get('old').value
  }

  get new(): string {
    return this.form.get('new').value
  }

  createForm(): FormGroup {
    return new FormGroup({
      old: new FormControl(null, [Validators.required]),
      new: new FormControl(null, [Validators.required])
    });
  }

  sql(): (arg: string) => string {
    return arg => `
      REPLACE(${arg}, '${this.old}', '${this.new}')
    `
  }
}
