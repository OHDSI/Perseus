import { ChangeDetectionStrategy, Component, forwardRef, Input, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CdmCheckboxComponent),
  multi: true
};

@Component({
  selector: 'app-cdm-checkbox',
  templateUrl: './cdm-checkbox.component.html',
  styleUrls: ['./cdm-checkbox.component.scss'],
  providers: [VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdmCheckboxComponent implements ControlValueAccessor {

  @Input()
  background = '#FFFFFF';

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
    if (state !== null) {
      this.state = state;
      this.onChange(state);
      this.onTouched();
    }
  }

  setState() {
    this.state = !this.state;
    this.onChange(this.state);
    this.onTouched();
  }
}
