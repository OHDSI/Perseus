import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';
import { Subscription } from 'rxjs';
import { TransformationFunctionType } from '@models/transformation/transformation-function-type';

export interface SqlFunctionForTransformation<T = any> {
  type: TransformationFunctionType
  value?: TransformationFunction<T>
  subscription?: Subscription
}

export interface SqlFunctionForTransformationState<T = any> {
  type: TransformationFunctionType,
  value: T
}

export function toState<T>({type, value: func}: SqlFunctionForTransformation<T>): SqlFunctionForTransformationState<T> {
  return {
    type,
    value: func.value
  }
}

export function fromState<T>({type}: SqlFunctionForTransformationState<T>): SqlFunctionForTransformation<T> {
  return {
    type
  }
}


