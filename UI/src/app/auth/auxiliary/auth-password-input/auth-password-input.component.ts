import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  Provider,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AuthPasswordInputComponent),
  multi: true
};

@Component({
  selector: 'app-auth-password-input',
  templateUrl: './auth-password-input.component.html',
  styleUrls: ['./auth-password-input.component.scss'],
  providers: [VALUE_ACCESSOR]
})
export class AuthPasswordInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

  password: string

  @ViewChild('passwordInput', {static: false})
  passwordInput: ElementRef

  focused = false;

  private focusListener: () => void
  private blurListener: () => void

  constructor(private renderer: Renderer2) {
  }

  onChange = (value: string) => {}

  onTouched = () => {}

  ngAfterViewInit() {
    this.focusListener = this.renderer.listen(this.passwordInput.nativeElement, 'focus', this.onFocus.bind(this))
    this.blurListener = this.renderer.listen(this.passwordInput.nativeElement, 'blur', this.onBlur.bind(this))
  }

  ngOnDestroy(): void {
    if (this.focusListener) {
      this.focusListener()
    }
    if (this.blurListener) {
      this.blurListener()
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(value: string): void {
    this.password = value
  }

  onFocus() {
    this.focused = true
    this.focusListener()
  }

  onBlur() {
    this.onTouched()
    this.blurListener()
  }
}
