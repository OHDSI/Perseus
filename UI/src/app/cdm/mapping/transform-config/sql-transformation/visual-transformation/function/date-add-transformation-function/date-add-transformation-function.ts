import { TransformationFunction } from '@mapping/transform-config/sql-transformation/visual-transformation/function/transformation-function';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePart, dateParts } from '@models/transformation/datepart';

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

  private get defaultDatePart() {
    return dateParts[0];
  }

  sql(): (arg: string) => string {
    return arg => `${arg} + (${this.number} * interval '1 ${this.datePart}')`
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      datePart: new FormControl(this.defaultDatePart, [Validators.required]),
      number: new FormControl(0, [Validators.required])
    });
  }
}
