import { Component } from '@angular/core';
import { AbstractScanDataConsoleComponent } from './abstract-scan-data-console.component';
import { WhiteRabbitWebsocketService } from '../../../../websocket/white-rabbit/white-rabbit-websocket.service';
import { takeUntil } from 'rxjs/operators';
import { ProgressNotification, ProgressNotificationStatusCode } from '../../../model/progress-notification';

@Component({
  selector: 'app-white-rabbit-scan-data-console',
  templateUrl: './scan-data-console.component.html',
  styleUrls: ['./scan-data-console.component.scss'],
  providers: [WhiteRabbitWebsocketService]
})
export class WhiteRabbitScanDataConsoleComponent extends AbstractScanDataConsoleComponent {

  private startedScanningItemsCount = 0;

  constructor(whiteRabbitWebSokcetService: WhiteRabbitWebsocketService) {
    super(whiteRabbitWebSokcetService);
  }

  protected onConnect(): void {
    this.scanningStarted = true;
    this.subscribeOnProgressMessages();
    this.subscribeOnResult();
    this.sendData();
  }

  protected sendData(): void {
    this.websocketService
      .send(this.params.endPoint, JSON.stringify(this.params.payload));
  }

  protected handleProgressMessage(message: string): void {
    const notification = JSON.parse(message) as ProgressNotification;

    this.showNotificationMessage(notification);
    this.scrollToConsoleBottom();

    switch (notification.status.code) {
      case ProgressNotificationStatusCode.TABLE_SCANNING: {
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
