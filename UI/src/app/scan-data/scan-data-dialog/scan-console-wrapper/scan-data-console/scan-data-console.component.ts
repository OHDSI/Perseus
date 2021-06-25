import { Component } from '@angular/core';
import { ConsoleDirective } from '../../../auxiliary/scan-console-wrapper/console/console.directive';
import { finalize } from 'rxjs/operators';
import {
  ProgressNotification,
  ProgressNotificationStatus,
  ProgressNotificationStatusCode,
  toFailedMessage
} from '@models/scan-data/progress-notification';
import { ScanDataWebsocketService } from '@websocket/white-rabbit/scan-data/scan-data-websocket.service';
import { ScanDataService } from '@services/white-rabbit/scan-data.service';
import { parseHttpError } from '@utils/error';

@Component({
  selector: 'scan-data-console',
  templateUrl: '../../../auxiliary/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../auxiliary/scan-console-wrapper/console/console.component.scss'],
  providers: [ScanDataWebsocketService]
})
export class ScanDataConsoleComponent extends ConsoleDirective<string> {

  private scannedItemsCount = 0;

  constructor(private scanDataWebsocketService: ScanDataWebsocketService,
              private whiteRabbitService: ScanDataService) {
    super(scanDataWebsocketService);
  }

  abortAndCancel() {
    if (this.scanDataWebsocketService.userId) {
      this.whiteRabbitService.abort(this.scanDataWebsocketService.userId)
        .pipe(finalize(() => this.websocketService.disconnect()))
        .subscribe()
    }
  }

  protected handleProgressMessage(message: string): void {
    const notification = JSON.parse(message) as ProgressNotification;
    this.showNotificationMessage(notification);

    switch ((notification.status as ProgressNotificationStatus).code) {
      case ProgressNotificationStatusCode.IN_PROGRESS: {
        this.progressValue = this.scannedItemsCount / this.params.itemsToScanCount * 100;
        this.scannedItemsCount++;
        break;
      }
      case ProgressNotificationStatusCode.FINISHED: {
        this.whiteRabbitService.result(this.scanDataWebsocketService.userId)
          .subscribe(
            result => this.onSuccess(result),
            error => {
              this.showNotificationMessage(toFailedMessage(parseHttpError(error)))
              this.onFailed()
            }
          )
        break;
      }
      case ProgressNotificationStatusCode.FAILED: {
        this.onFailed()
        break;
      }
    }
  }
}
