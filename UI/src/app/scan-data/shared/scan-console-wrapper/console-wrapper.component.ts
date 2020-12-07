import { EventEmitter, Output, ViewChild } from '@angular/core';
import { ScanDataConsoleComponent } from './scan-data-console/scan-data-console.component';

export abstract class ConsoleWrapperComponent {
  @ViewChild(ScanDataConsoleComponent)
  scanDataConsoleComponent: ScanDataConsoleComponent;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  onAbortAndCancel() {
    this.scanDataConsoleComponent.abortAndCancel();
    this.cancel.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
