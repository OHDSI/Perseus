import { ChangeDetectionStrategy, Component, forwardRef, Input, Provider } from '@angular/core';
import { Filter, FilterValue } from '../../../models/filter/filter';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FilterDropdownComponent),
  multi: true
};

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
  providers: [VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    if (state !== null) {
      this.state = state
      this.onChange(this.state)
    }
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

  onCheckFilter(filterValue: FilterValue) {
    filterValue.checked = !filterValue.checked;

    if (filterValue.checked) {
      this.state.push(filterValue);
    } else {
      const index = this.state.indexOf(filterValue);
      this.state.splice(index, 1);
    }

    this.onChange(this.state)
  }
}
