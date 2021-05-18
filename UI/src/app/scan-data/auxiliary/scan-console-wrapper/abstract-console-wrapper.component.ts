import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConsoleComponent } from './console/console.component';
import { WebsocketParams } from '../../../models/scan-data/websocket-params';
import { ProgressNotificationStatusCode } from '../../../models/scan-data/progress-notification';

export abstract class AbstractConsoleWrapperComponent {

  result: any;

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

  protected showErrorMessage(message: string) {
    this.scanDataConsoleComponent.showNotificationMessage({
      message,
      status: {
        code: ProgressNotificationStatusCode.ERROR
      }
    })
  }
}
