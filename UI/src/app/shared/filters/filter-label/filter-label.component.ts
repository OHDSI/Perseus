import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterValue } from '../filter-list/filter-list.component';

export interface Filter {
  name: string;
  field: string;
  color: string;
  values: FilterValue[];
}

@Component({
  selector: 'app-filter-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss']
})
export class FilterLabelComponent {

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
