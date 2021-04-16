import { Component, OnInit } from '@angular/core';
import { ConsoleComponent } from '../../../shared/scan-console-wrapper/console/console.component';
import { CdmBuilderWebsocketService } from '../../../../websocket/cdm-builder/cdm-builder-websocket.service';
import { CdmProgressNotification, ProgressNotificationStatusCode } from '../../../model/progress-notification';

@Component({
  selector: 'app-cdm-console',
  templateUrl: '../../../shared/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../shared/scan-console-wrapper/console/console.component.scss'],
  providers: [CdmBuilderWebsocketService]
})
export class CdmConsoleComponent extends ConsoleComponent implements OnInit {

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
