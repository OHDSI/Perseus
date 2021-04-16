import { Component } from '@angular/core';
import { ConsoleComponent } from '../../../shared/scan-console-wrapper/console/console.component';
import { finalize } from 'rxjs/operators';
import {
  ProgressNotification,
  ProgressNotificationStatus,
  ProgressNotificationStatusCode
} from '../../../model/progress-notification';
import { ScanDataWebsocketService } from '../../../../websocket/white-rabbit/scan-data/scan-data-websocket.service';
import { ScanDataService } from '../../../../services/white-rabbit/scan-data.service';
import { parseHttpError } from '../../../../services/utilites/error';

@Component({
  selector: 'scan-data-console',
  templateUrl: '../../../shared/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../shared/scan-console-wrapper/console/console.component.scss'],
  providers: [ScanDataWebsocketService]
})
export class ScanDataConsoleComponent extends ConsoleComponent {

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
        this.progressValue = 100
        this.websocketService.disconnect()
        this.whiteRabbitService.result(this.scanDataWebsocketService.userId)
          .subscribe(
            result => this.finish.emit(result),
            error => this.showNotificationMessage({
              message: parseHttpError(error),
              status: {
                code: ProgressNotificationStatusCode.ERROR
              }
            })
          )
        break;
      }
      case ProgressNotificationStatusCode.FAILED: {
        this.progressValue = 0;
        this.websocketService.disconnect();
        break;
      }
    }
  }
}
