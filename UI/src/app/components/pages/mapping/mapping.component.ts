import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as dataActions from 'src/app/store/actions/data.actions';
import * as sourceActions from 'src/app/store/actions/source.actions';
import { HttpClient } from '@angular/common/http';
import * as fromStore from 'src/app/store/reducers/data.reducer';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  data$: Observable<any> = null;
  tables$: Observable<any> = null;

  constructor(
    private store: Store<any>,
    @Inject(DOCUMENT) private document: Document,
    private httpClient: HttpClient
  ) {
    this.data$ = store.pipe(select('data'));
    this.data$.subscribe(val => console.log(val));
  }

  ngOnInit() {
    this.httpClient
      .get<any>(`http://127.0.0.1:5000/get_cdm_schema?cdm_version=5.0.1`, {responseType: 'json'}).subscribe(val => this.initialize(val));

    this.tables$ = this.store.select(fromStore.getSourceTables);
  }

  initialize(data) {
    const state = {
      source: {
        tables: [],
        rows: [],
        comments: []
      },
      target: {
        tables: [],
        rows: [],
        comments: []
      }
    };

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      state.source.tables.push(
        {
          id: i,
          area: 'source',
          name: item.table_name,
          rows: item.column_list,
      });

      for (let j = 0; j < item.column_list.length; j++) {
        state.source.rows.push({
          tableId: i,
          rowId: j,
          area: 'source',
          tableName: item.table_name,
          row: item.column_list[j]
        });

        state.source.comments.push({
          tableId: i,
          rowId: j,
          area: 'source',
          tableName: item.table_name,
          row: item.column_list[j]
        });
      }
    }

    // for (let i = 0; i < data.length; i++) {
    //   const item = data[i];

    //   state.target.tables.push(
    //     {
    //       id: i,
    //       area: 'target',
    //       name: item.table_name,
    //       rows: item.column_list,
    //   });

    //   for (let j = 0; j < item.column_list.length; j++) {
    //     state.target.rows.push({
    //       tableId: i,
    //       rowId: j,
    //       area: 'target',
    //       tableName: item.table_name,
    //       row: item.column_list[j]
    //     });

    //     state.target.comments.push({
    //       tableId: i,
    //       rowId: j,
    //       area: 'target',
    //       tableName: item.table_name,
    //       row: item.column_list[j]
    //     });
    //   }
    // }

    this.store.dispatch(new sourceActions.Initialize(state.source.tables));
  }
}
