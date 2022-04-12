import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { Subscription } from 'rxjs';
import { TransformationFunctionType } from '@models/transformation/transformation-function-type';
import { FunctionType } from '@models/transformation/function-type';
import { functionTypes } from '@mapping/sql-transformation/visual-transformation/visual-transformation';

export interface SqlFunctionForTransformation<T = any> {
  type: TransformationFunctionType
  value?: TransformationFunction<T>
  subscription?: Subscription
}

export interface SqlFunctionForTransformationState<T = any> {
  type: FunctionType,
  value: T
}

export function toState<T>({type, value: func}: SqlFunctionForTransformation<T>): SqlFunctionForTransformationState<T> {
  return {
    type: type.name,
    value: func.value
  }
}

export function fromState<T>({type}: SqlFunctionForTransformationState<T>): SqlFunctionForTransformation<T> {
  return {
    type: typeToTransformationType(type)
  }
}

function typeToTransformationType(type: FunctionType): TransformationFunctionType {
  return functionTypes.find(funcType => funcType.name === type)
}

