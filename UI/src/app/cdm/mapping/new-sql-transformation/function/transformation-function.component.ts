import { Input } from '@angular/core';
import { TransformationFunction } from '@mapping/new-sql-transformation/function/transformation-function';

export abstract class TransformationFunctionComponent<T> {

  @Input()
  function: TransformationFunction<T>
}
