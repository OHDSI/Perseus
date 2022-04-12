import { TransformationFunction } from '@mapping/transform-config/sql-transformation/visual-transformation/function/transformation-function';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePart, dateParts } from '@models/transformation/datepart';

export interface DatePartModel {
  part: DatePart
}

export class DatePartTransformationFunction extends TransformationFunction<DatePartModel> {

  private get part(): string {
    return this.form.get('part').value
  }

  sql(): (arg: string) => string {
    return (arg: string) => `date_part('${this.part}', ${arg})`;
  }

  private get defaultPart(){
    return dateParts[0];
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      part: new FormControl(this.defaultPart, [Validators.required])
    });
  }
}
