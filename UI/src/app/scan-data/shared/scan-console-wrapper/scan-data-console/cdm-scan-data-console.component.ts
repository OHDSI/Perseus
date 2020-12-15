import { Component, OnInit } from '@angular/core';
import { AbstractScanDataConsoleComponent } from './abstract-scan-data-console.component';
import { CdmBuilderWebsocketService } from '../../../../websocket/cdm-builder/cdm-builder-websocket.service';
import { CdmProgressNotification, ProgressNotificationStatusCode } from '../../../model/progress-notification';

@Component({
  selector: 'app-cdm-scan-data-console',
  templateUrl: './scan-data-console.component.html',
  styleUrls: ['./scan-data-console.component.scss'],
  providers: [CdmBuilderWebsocketService]
})
export class CdmScanDataConsoleComponent extends AbstractScanDataConsoleComponent implements OnInit {

  constructor(private cdmWebSocketService: CdmBuilderWebsocketService) {
    super(cdmWebSocketService);
  }

  protected handleProgressMessage(notification: CdmProgressNotification): void {
    this.progressValue = notification.progress;
    this.showNotificationMessage({
      status: {code: notification.status},
      message: notification.text
    });

    switch (notification.status) {
      case ProgressNotificationStatusCode.FINISHED: {
        this.finish.emit('Finished');
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
