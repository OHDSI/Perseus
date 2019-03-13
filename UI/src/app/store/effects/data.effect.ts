import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/services/data.service';
import * as dataActions from 'src/app/store/actions/data.actions';

@Injectable()
export class CustomerEffect {
    constructor(
        private actions$: Actions,
        private dataService: DataService
    ) {}

//     @Effect
//     loadData$: Observable<Action> = this.actions$.pipe(
//         ofType<dataActions.LoadData>(
//             dataActions.DataActionTypes.LOAD_DATA
//         ),
//         mergeMap((action: dataActions.LoadData) =>
//         )
//       )
//     )
// }
