import { TransformationFunction } from '@mapping/transform-config/sql-transformation/visual-transformation/function/transformation-function';
import { FormGroup } from '@angular/forms';

export abstract class NoArgsTransformationFunction extends TransformationFunction<void> {

  get valid(): boolean {
    return true;
  }

  get touched(): boolean {
    return false
  }

  get dirty(): boolean {
    return false
  }

  protected createForm(): FormGroup {
    return new FormGroup({});
  }
}
