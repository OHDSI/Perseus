import { Component, Inject } from '@angular/core';
import { TransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function.component';
import { ReplaceTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function';

@Component({
  selector: 'app-replace-transformation-function',
  templateUrl: './replace-transformation-function.component.html',
  styleUrls: ['./replace-transformation-function.component.scss']
})
export class ReplaceTransformationFunctionComponent extends TransformationFunctionComponent {

  constructor(@Inject('function') transformationFunction: ReplaceTransformationFunction) {
    super(transformationFunction);
  }
}
