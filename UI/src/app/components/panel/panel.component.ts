import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Expanded } from 'src/app/store/actions/common.actions';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() title: string;

  constructor(private store: Store<{ hint: string }>) {
    
  }
  ngOnInit() {
  }

  onClickMe() {
    this.store.dispatch(new Expanded());
  }

}
