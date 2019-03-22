import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Collapsed, Expanded, Linked } from 'src/app/pages/mapping/store/actions/common.actions';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  @Input() area: string;

  ngOnInit() {}
}
