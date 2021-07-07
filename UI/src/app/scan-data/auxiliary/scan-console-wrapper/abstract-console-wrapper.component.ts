import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConsoleComponent } from './console/console.component';
import { WebsocketParams } from '../../../models/scan-data/websocket-params';
import { ProgressNotificationStatusCode } from '../../../models/scan-data/progress-notification';
import { ScanResult, ScanStatus } from '../../../models/scan-data/scan-result';

export abstract class AbstractConsoleWrapperComponent<T> {

  result: ScanResult<T> = {
    status: ScanStatus.IN_PROGRESS
  }

  @Input()
  params: WebsocketParams;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  @ViewChild(ConsoleComponent)
  abstract consoleComponent: ConsoleComponent<T>;

  onComplete(result: ScanResult<T>) {
    this.result = result
  }

  onAbortAndCancel() {
    this.consoleComponent.abortAndCancel();
    this.cancel.emit();
  }

  onBack() {
    this.cancel.emit();
  }

  onClose() {
    this.close.emit()
  }

  protected showErrorMessage(message: string) {
    this.consoleComponent.showNotificationMessage({
      message,
      status: {
        code: ProgressNotificationStatusCode.ERROR
      }
    })
  }
}
