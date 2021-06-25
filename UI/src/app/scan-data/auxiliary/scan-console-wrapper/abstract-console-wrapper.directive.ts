import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConsoleDirective } from './console/console.directive';
import { WebsocketParams } from '@models/scan-data/websocket-params';
import { ProgressNotificationStatusCode } from '@models/scan-data/progress-notification';
import { ScanResult, ScanStatus } from '@models/scan-data/scan-result';

@Directive()
export abstract class AbstractConsoleWrapperDirective<T> {

  result: ScanResult<T> = {
    status: ScanStatus.IN_PROGRESS
  }

  @Input()
  params: WebsocketParams;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  @ViewChild(ConsoleDirective)
  abstract consoleComponent: ConsoleDirective<T>;

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
