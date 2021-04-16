import { Component } from '@angular/core';
import { ConsoleComponent } from '../../../shared/scan-console-wrapper/console/console.component';
import { FakeDataWebsocketService } from '../../../../websocket/white-rabbit/fake-data/fake-data-websocket.service';
import { FakeDataService } from '../../../../services/white-rabbit/fake-data.service';
import {
  ProgressNotification,
  ProgressNotificationStatus,
  ProgressNotificationStatusCode
} from '../../../model/progress-notification';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-fake-console',
  templateUrl: '../../../shared/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../shared/scan-console-wrapper/console/console.component.scss'],
  providers: [FakeDataWebsocketService]
})
export class FakeConsoleComponent extends ConsoleComponent {

  private scannedItemsCount = 0;

  constructor(private fakeDataWebsocketService: FakeDataWebsocketService,
              private fakeDataService: FakeDataService) {
    super(fakeDataWebsocketService)
  }

  abortAndCancel() {
    if (this.fakeDataWebsocketService.userId) {
      this.fakeDataService.abort(this.fakeDataWebsocketService.userId)
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
        this.finish.emit()
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
