import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterValue } from '../filter-list/filter-list.component';

export interface Filter {
  name: string;
  field: string;
  color: string;
  values: FilterValue[];
}

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.scss']
})
export class FilterItemComponent {

  @Input()
  name: string;

  @Input()
  color: string;

  @Input()
  opened: boolean;

  @Output()
  open = new EventEmitter<string>();

  onOpen() {
    this.open.emit(this.name);
  }
}
