import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface DatePartModel {
  part: 'Year' | 'Month' | 'Day' | 'Hour' | 'Minute' | 'Second'
}

export class DatePartTransformationFunction extends TransformationFunction<DatePartModel> {

  private get part(): string {
    return this.form.get('part').value
  }

  sql(): (arg: string) => string {
    return (arg: string) => `DATEPART(${arg}, ${this.part})`;
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      part: new FormControl(null, [Validators.required])
    });
  }
}
