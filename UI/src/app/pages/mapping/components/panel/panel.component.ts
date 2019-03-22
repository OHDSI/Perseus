import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expanded } from 'src/app/pages/mapping/store/actions/common.actions';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() title: string;
  @Input() columnList: any[];
  
  constructor(private store: Store<{ hint: string }>) {}

  ngOnInit() { }

  onPanelClick() {
    //this.store.dispatch(new Expanded());
  }

}
