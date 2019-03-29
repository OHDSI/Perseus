import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DataService } from 'src/app/services/data.service';
import * as dataActions from 'src/app/store/actions/data.actions';

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
    @Inject(DOCUMENT) private document: Document,
    private httpClient: HttpClient
  ) {
    this.common$ = store.pipe(select('common'));
    this.data$ = store.pipe(select('data'));
  }

  ngOnInit() {
    // this.httpClient.get<any>(`http://127.0.0.1:5000/load_report?path=C:/Projects/CDM/CDMSouffleur/UI/mdcr.xlsx`)
    // .subscribe(val => {
    //   debugger;
    //   console.log(val)
    // });

    // setTimeout(() => {
    //     this.httpClient.get<any>(`http://127.0.0.1:5000/get_source_schema`).subscribe(val => console.log(val));
    // }, 5000);
    
    //this.store.dispatch(new Collapsed());
    this.store.dispatch(new dataActions.FetchData());
  }
  
}
