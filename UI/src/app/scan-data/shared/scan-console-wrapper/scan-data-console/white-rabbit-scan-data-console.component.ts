import { Component } from '@angular/core';
import { AbstractScanDataConsoleComponent } from './abstract-scan-data-console.component';
import { ScanDataWebsocketService } from '../../../../websocket/white-rabbit/scan-data-websocket.service';
import { takeUntil } from 'rxjs/operators';
import {
  ProgressNotification,
  ProgressNotificationStatus,
  ProgressNotificationStatusCode
} from '../../../model/progress-notification';

@Component({
  selector: 'app-white-rabbit-scan-data-console',
  templateUrl: './scan-data-console.component.html',
  styleUrls: ['./scan-data-console.component.scss'],
  providers: [ScanDataWebsocketService]
})
export class WhiteRabbitScanDataConsoleComponent extends AbstractScanDataConsoleComponent {

  private startedScanningItemsCount = 0;

  constructor(whiteRabbitWebSocketService: ScanDataWebsocketService) {
    super(whiteRabbitWebSocketService);
  }

  protected onConnect(): void {
    this.scanningStarted = true;
    this.subscribeOnProgressMessages();
    this.subscribeOnResult();
    this.sendData();
  }

  protected sendData(): void {
    this.websocketService
      .send(this.params.endPoint, this.params.payload);
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
        this.progressValue = 100;
        break;
      }
      case ProgressNotificationStatusCode.FAILED: {
        this.progressValue = 0;
        this.websocketService.disconnect();
        break;
      }
    }
  }

  private subscribeOnResult(): void {
    this.websocketService
      .on(this.params.resultDestination)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(result => {
        this.websocketService.disconnect();
        this.finish.emit(result);
      });
  }
}
