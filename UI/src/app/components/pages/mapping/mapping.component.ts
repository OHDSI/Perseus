import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as dataActions from 'src/app/store/actions/data.actions';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  common$: Observable<any>;

  dataSource$: Observable<any>;
  dataTarget$: Observable<any>;

  constructor(
    private store: Store<any>,
    @Inject(DOCUMENT) private document: Document,
    private httpClient: HttpClient
  ) {
    //this.dataSource$ = store.pipe(select('data'));
    //this.store.dispatch(new dataActions.FetchData());
  }

  ngOnInit() {
    this.dataTarget$ = this.httpClient
      .get<any>(`http://127.0.0.1:5000/get_cdm_schema?cdm_version=5.0.1`, {responseType: 'json'});
  }
  
}
