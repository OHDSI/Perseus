import { Component, Inject } from '@angular/core';
import { TransformationFunctionComponent } from '@mapping/transform-config/sql-transformation/visual-transformation/function/transformation-function.component';
import {
  DatePartModel,
  DatePartTransformationFunction
} from '@mapping/transform-config/sql-transformation/visual-transformation/function/date-part-transformation-function/date-part-transformation-function';
import { dateParts } from '@models/transformation/datepart';

@Component({
  selector: 'app-date-part-transformation-function',
  templateUrl: './date-part-transformation-function.component.html',
  styleUrls: ['./date-part-transformation-function.component.scss']
})
export class DatePartTransformationFunctionComponent extends TransformationFunctionComponent<DatePartModel> {

  dateparts = dateParts

  constructor(@Inject('function') transformationFunction: DatePartTransformationFunction) {
    super(transformationFunction)
  }
}
