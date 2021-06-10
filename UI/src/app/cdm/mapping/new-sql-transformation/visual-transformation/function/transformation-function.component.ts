import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';

export abstract class TransformationFunctionComponent<T = any> {

  protected constructor(protected transformationFunction: TransformationFunction<T>) {
  }

  get function() {
    return this.transformationFunction
  }

  get form() {
    return this.transformationFunction.form
  }
}
