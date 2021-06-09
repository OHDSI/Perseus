import { TransformationFunction } from '@mapping/new-sql-transformation/function/transformation-function';
import { ReplaceTransformationFunction } from '@mapping/new-sql-transformation/function/replace-transformation-function/replace-transformation-function';

export function transformationFunctionByType(type: string): TransformationFunction<any> {
  switch (type) {
    case 'REPLACE': {
      return new ReplaceTransformationFunction()
    }
  }
}
