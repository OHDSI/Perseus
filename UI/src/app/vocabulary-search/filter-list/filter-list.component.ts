import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent {

  @Input()
  values: {
    name: string,
    count: number,
    checked: boolean,
    disabled: boolean
  }[];
}
