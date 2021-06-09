import { Component } from '@angular/core';
import { TransformationFunctionComponent } from '@mapping/new-sql-transformation/function/transformation-function.component';
import { ReplaceModel } from '@mapping/new-sql-transformation/function/replace-transformation-function/replace-transformation-function';

@Component({
  selector: 'app-replace-transformation-function',
  templateUrl: './replace-transformation-function.component.html',
  styleUrls: ['./replace-transformation-function.component.scss']
})
export class ReplaceTransformationFunctionComponent extends TransformationFunctionComponent<ReplaceModel> {
}
