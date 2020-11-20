import { ChangeDetectionStrategy, Component, forwardRef, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ScanDataCheckboxComponent),
  multi: true
};

@Component({
  selector: 'app-scan-data-checkbox',
  templateUrl: './scan-data-checkbox.component.html',
  styleUrls: ['./scan-data-checkbox.component.scss'],
  providers: [VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataCheckboxComponent implements ControlValueAccessor {

  state: boolean;

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(state: boolean): void {
    this.state = state;
    this.onChange(state);
    this.onTouched();
  }

  setState() {
    this.state = !this.state;
    this.onChange(this.state);
    this.onTouched();
  }
}
