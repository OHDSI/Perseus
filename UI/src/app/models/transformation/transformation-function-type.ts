import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { TransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/transformation-function.component';

export interface TransformationFunctionType<C extends TransformationFunctionComponent = any, F = any> {
  name: string,
  componentClass: new(f: TransformationFunction<F>) => C,
  createFunction: (value?: F) => TransformationFunction<F>
}
