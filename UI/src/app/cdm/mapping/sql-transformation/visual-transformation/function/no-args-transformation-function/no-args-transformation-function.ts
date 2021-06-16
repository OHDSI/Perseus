import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { FormGroup } from '@angular/forms';

export abstract class NoArgsTransformationFunction extends TransformationFunction<void> {

  get valid(): boolean {
    return true;
  }

  protected createForm(): FormGroup {
    return new FormGroup({});
  }
}
