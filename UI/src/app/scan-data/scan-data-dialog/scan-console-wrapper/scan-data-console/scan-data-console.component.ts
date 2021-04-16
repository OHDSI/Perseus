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

@Component({
  selector: 'scan-data-console',
  templateUrl: '../../../shared/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../shared/scan-console-wrapper/console/console.component.scss'],
  providers: [ScanDataWebsocketService]
})
export class ScanDataConsoleComponent extends ConsoleComponent {

  private startedScanningItemsCount = 0;

  constructor(private scanDataWebsocketService: ScanDataWebsocketService,
              private whiteRabbitService: ScanDataService) {
    super(scanDataWebsocketService);
  }

  abortAndCancel() {
    this.whiteRabbitService.abort(this.scanDataWebsocketService.userId)
      .pipe(finalize(() => this.websocketService.disconnect()))
      .subscribe()
  }

  protected handleProgressMessage(message: string): void {
    const notification = JSON.parse(message) as ProgressNotification;

    this.showNotificationMessage(notification);
    this.scrollToConsoleBottom();

    switch ((notification.status as ProgressNotificationStatus).code) {
      case ProgressNotificationStatusCode.IN_PROGRESS: {
        this.progressValue = this.startedScanningItemsCount / this.params.itemsToScanCount * 100;
        this.startedScanningItemsCount++;
        break;
      }
      case ProgressNotificationStatusCode.FINISHED: {
        this.progressValue = 100
        this.websocketService.disconnect()
        this.whiteRabbitService.result(this.scanDataWebsocketService.userId)
          .subscribe(result => this.finish.emit(result))
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
