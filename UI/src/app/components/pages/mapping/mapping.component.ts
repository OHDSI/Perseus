import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Collapsed, Expanded, Linked } from 'src/app/store/actions/common.actions';
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

  constructor( private store: Store<any>, private dataService: DataService ) {
      this.common$ = store.pipe(select('common'));
      this.data$ = store.pipe(select('data'));
  }

  ngOnInit() {
    this.store.dispatch(new Collapsed());
    this.store.dispatch(new dataActions.FetchData())

    this.data$.subscribe(tables => console.log(tables))
  }


}
