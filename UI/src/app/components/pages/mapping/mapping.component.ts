import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Collapsed, Expanded, Linked } from 'src/app/store/actions/common.actions';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  hint$: Observable<any>;

  constructor(private store: Store<{ hint: string }>) {
    this.hint$ = store.pipe(select('common'));
  }

  ngOnInit() {
    this.store.dispatch(new Collapsed());
  }


}
