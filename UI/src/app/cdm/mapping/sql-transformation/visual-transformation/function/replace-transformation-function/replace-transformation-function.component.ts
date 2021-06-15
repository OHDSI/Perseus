import { Component, Inject } from '@angular/core';
import { TransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/transformation-function.component';
import {
  ReplaceModel,
  ReplaceTransformationFunction
} from '@mapping/sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function';

@Component({
  selector: 'app-replace-transformation-function',
  templateUrl: './replace-transformation-function.component.html',
  styleUrls: ['./replace-transformation-function.component.scss']
})
export class ReplaceTransformationFunctionComponent extends TransformationFunctionComponent<ReplaceModel> {

  constructor(@Inject('function') transformationFunction: ReplaceTransformationFunction) {
    super(transformationFunction);
  }
}
