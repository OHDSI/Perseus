import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import * as dataActions from 'src/app/store/actions/data.actions';
import { DataService } from 'src/app/services/data.service';
import { Table } from 'src/app/models/table';
import { Data } from 'src/app/models/data';

@Injectable()
export class DataEffect {
    constructor(
        private actions$: Actions,
        private dataService: DataService
    ) {}

  @Effect()
  fetchData$: Observable<Action> = this.actions$.pipe(
    ofType<dataActions.FetchData>(
      dataActions.DataActionTypes.FETCH_DATA
    ),
    mergeMap((action: dataActions.FetchData) =>
      this.dataService.retrieveData().pipe(
        map((data: Data) => 
          new dataActions.FetchDataSuccess(data)
        ),
        catchError(err => of(new dataActions.FetchDataFail(err)))
      )
    )
  )

}
