import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePart } from '@models/transformation/datepart';

export interface DateAddModel {
  datePart: DatePart,
  number: number
}

export class DateAddTransformationFunction extends TransformationFunction<DateAddModel> {

  private get datePart() {
    return this.form.get('datePart').value
  }

  private get number() {
    return this.form.get('number').value
  }

  sql(): (arg: string) => string {
    return arg => `DATEADD(${this.datePart}, ${this.number}, ${arg})`
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      datePart: new FormControl(null, [Validators.required]),
      number: new FormControl(null, [Validators.required])
    });
  }
}
