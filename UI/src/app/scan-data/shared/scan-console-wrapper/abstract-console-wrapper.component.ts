import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConsoleComponent } from './console/console.component';
import { WebsocketParams } from '../../model/websocket-params';

export abstract class AbstractConsoleWrapperComponent {

  result: string;

  @Input()
  params: WebsocketParams;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  @ViewChild(ConsoleComponent)
  abstract scanDataConsoleComponent: ConsoleComponent;

  onAbortAndCancel() {
    this.scanDataConsoleComponent.abortAndCancel();
    this.cancel.emit();
  }

  onBack() {
    this.cancel.emit();
  }
}
