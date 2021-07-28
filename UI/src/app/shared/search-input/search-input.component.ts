import { Component, ElementRef, forwardRef, Input, Provider, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchInputComponent),
  multi: true
};

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [VALUE_ACCESSOR]
})
export class SearchInputComponent implements ControlValueAccessor {

  value: string

  @Input()
  placeholder = 'Search by Keywords'

  disabled = false

  @ViewChild('keyWordInput')
  private keyWordInput: ElementRef

  onChange = (value: string) => {}

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: string): void {
    this.value = value
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onChangeValue(value: string) {
    this.value = value
    this.onChange(value)
  }
}
