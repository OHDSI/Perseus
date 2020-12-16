import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractScanDataConsoleComponent } from './scan-data-console/abstract-scan-data-console.component';
import { WebsocketParams } from '../../model/websocket-params';

export abstract class AbstractConsoleWrapperComponent {

  result: string;

  @Input()
  params: WebsocketParams;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  @ViewChild(AbstractScanDataConsoleComponent)
  abstract scanDataConsoleComponent: AbstractScanDataConsoleComponent;

  onAbortAndCancel() {
    this.scanDataConsoleComponent.abortAndCancel();
    this.cancel.emit();
  }

  onBack() {
    this.cancel.emit();
  }
}
