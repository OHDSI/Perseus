import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterValue } from '../../../../models/filter/filter';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent implements OnInit {

  filter = '';

  @Input()
  values: FilterValue[];

  filteredValues: FilterValue[];

  @Output()
  check = new EventEmitter<FilterValue>();

  ngOnInit(): void {
    this.filteredValues = this.values;
  }

  onCheck(index: number) {
    this.check.emit(this.filteredValues[index]);
  }

  onFilter(value: string) {
    const parsedValue = value.toLowerCase();
    this.filteredValues = this.values.filter(filter => filter.name
      .toLowerCase()
      .includes(parsedValue)
    );
  }
}
