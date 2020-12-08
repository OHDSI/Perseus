import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ScanDataConsoleComponent } from './scan-data-console/scan-data-console.component';
import { WebsocketParams } from '../../model/websocket-params';

export abstract class AbstractConsoleWrapperComponent {

  result: string;

  @Input()
  params: WebsocketParams;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  @ViewChild(ScanDataConsoleComponent)
  scanDataConsoleComponent: ScanDataConsoleComponent;

  onAbortAndCancel() {
    this.scanDataConsoleComponent.abortAndCancel();
    this.cancel.emit();
  }

  onBack() {
    this.cancel.emit();
  }
}
