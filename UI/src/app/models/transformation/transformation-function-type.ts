import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { TransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/transformation-function.component';
import { FunctionType } from '@models/transformation/function-type';
import { FieldType } from '@utils/field-type';

export interface TransformationFunctionType<C extends TransformationFunctionComponent = any, F = any> {
  name: FunctionType,
  componentClass: new(f: TransformationFunction<F>) => C,
  createFunction: (value?: F, fieldType?: FieldType) => TransformationFunction<F>
}
