import { Component, forwardRef, Input, Provider } from '@angular/core';
import { Filter, FilterValue } from '@models/filter/filter';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filterValues, findFilterValue } from '@shared/filters/filter-dropdown/filter-dropdown'

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FilterDropdownComponent),
  multi: true
};

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
  providers: [VALUE_ACCESSOR]
})
export class FilterDropdownComponent implements ControlValueAccessor {

  state: FilterValue[] = []

  @Input()
  filter: Filter

  @Input()
  openedFilterName: string

  @Input()
  paddingLeft = 30

  private onChange = (value: FilterValue[]) => {}

  registerOnChange(fn: (value: FilterValue[]) => void): void {
    this.onChange = fn
  }

  writeValue(state: FilterValue[]): void {
    this.state = state
    this.onChange(this.state)
  }

  registerOnTouched(fn: any): void {
  }

  onOpen(filterName: string) {
    if (this.openedFilterName === filterName) {
      this.openedFilterName = null;
    } else {
      this.openedFilterName = filterName;
    }
  }

  onCheck(filterValue: FilterValue) {
    if (this.state.find(findFilterValue(filterValue))) {
      this.state = this.state.filter(filterValues(filterValue))
    } else {
      this.state = [...this.state, filterValue]
    }

    this.onChange(this.state)
  }
}
