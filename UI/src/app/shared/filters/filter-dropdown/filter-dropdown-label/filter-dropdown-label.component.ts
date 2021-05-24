import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterValue } from '../filter-list/filter-list.component';
import { FilterLabelComponent } from '../../filter-label/filter-label.component';

export interface Filter {
  name: string;
  field: string;
  color: string;
  values: FilterValue[];
}

@Component({
  selector: 'app-filter-dropdown-label',
  templateUrl: './filter-dropdown-label.component.html',
  styleUrls: [
    './filter-dropdown-label.component.scss',
    '../../filter-label/filter-label.component.scss'
  ]
})
export class FilterDropdownLabelComponent extends FilterLabelComponent {

  @Input()
  opened: boolean;

  @Output()
  open = new EventEmitter<string>();

  onOpen() {
    this.open.emit(this.name);
  }
}
