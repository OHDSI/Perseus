import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Collapsed, Expanded, Linked } from 'src/app/pages/mapping/store/actions/common.actions';
import { DataService } from 'src/app/pages/mapping/services/data.service';
import * as dataActions from 'src/app/pages/mapping/store/actions/data.actions';


@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  common$: Observable<any>;
  data$: Observable<any>;

  constructor(
    private store: Store<any>,
    private dataService: DataService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.common$ = store.pipe(select('common'));
    this.data$ = store.pipe(select('data'));
  }

  ngOnInit() {
    //this.store.dispatch(new Collapsed());
    this.store.dispatch(new dataActions.FetchData())
  }
  
}
