import { Component, Inject } from '@angular/core';
import { dateParts } from '@models/transformation/datepart';
import { TransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function.component';
import {
  DateAddModel,
  DateAddTransformationFunction
} from '@mapping/new-sql-transformation/visual-transformation/function/date-add-transformation-function/date-add-transformation-function';

@Component({
  selector: 'app-date-add-transformation-function',
  templateUrl: './date-add-transformation-function.component.html',
  styleUrls: ['./date-add-transformation-function.component.scss']
})
export class DateAddTransformationFunctionComponent extends TransformationFunctionComponent<DateAddModel> {

  dateparts = dateParts

  constructor(@Inject('function') transformationFunction: DateAddTransformationFunction) {
    super(transformationFunction);
  }
}
