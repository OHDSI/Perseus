import { TransformationFunction } from '@mapping/new-sql-transformation/function/transformation-function';
import { Subscription } from 'rxjs';

export interface SqlFunction {
  type: string
  value?: TransformationFunction<any>
  subscription?: Subscription
}
