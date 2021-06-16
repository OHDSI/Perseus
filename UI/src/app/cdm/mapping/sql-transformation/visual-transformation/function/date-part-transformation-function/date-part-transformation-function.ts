import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePart } from '@models/transformation/datepart';

export interface DatePartModel {
  part: DatePart
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
