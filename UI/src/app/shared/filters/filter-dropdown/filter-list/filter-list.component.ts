import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterValue } from '@models/filter/filter';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent {

  filter: string;

  allValues: FilterValue[]

  filteredValues: FilterValue[];

  @Input()
  paddingLeft: number

  @Input()
  selectedValues: FilterValue[]

  @Output()
  check = new EventEmitter<FilterValue>();

  @Input()
  private set values(values: FilterValue[]) {
    this.filter = null
    this.allValues = values
    this.filteredValues = values
  }

  onCheck(index: number) {
    let value = this.filteredValues[index]
    value = this.selectedValues.find(v => v.name === value.name) || value
    this.check.emit({...value, checked: !value.checked});
  }

  onFilter(value: string) {
    const parsedValue = value.toLowerCase();
    this.filteredValues = this.allValues.filter(filter => filter.name
      .toLowerCase()
      .includes(parsedValue)
    );
  }

  toValueCount(count: number): string {
    return count !== null && count !== undefined ? `(${count})` : ''
  }

  isChecked(curr: FilterValue): boolean {
    return !!this.selectedValues
      .find(elem => elem.name === curr.name && elem.filterIndex === curr.filterIndex)
  }
}
