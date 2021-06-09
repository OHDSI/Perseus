import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';
import { Subscription } from 'rxjs';
import { TransformationFunctionType } from '@models/transformation/transformation-function-type';

export interface SqlFunctionForTransformation<T = any> {
  type: TransformationFunctionType
  value?: TransformationFunction<T>
  subscription?: Subscription
}
