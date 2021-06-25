import { Component, OnInit } from '@angular/core';
import { ConsoleDirective } from '../../../auxiliary/scan-console-wrapper/console/console.directive';
import { CdmBuilderWebsocketService } from '@websocket/cdm-builder/cdm-builder-websocket.service';
import { CdmProgressNotification, ProgressNotificationStatusCode } from '@models/scan-data/progress-notification';

@Component({
  selector: 'app-cdm-console',
  templateUrl: '../../../auxiliary/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../auxiliary/scan-console-wrapper/console/console.component.scss'],
  providers: [CdmBuilderWebsocketService]
})
export class CdmConsoleComponent extends ConsoleDirective<void> implements OnInit {

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
        this.onSuccess()
        break;
      }
      case ProgressNotificationStatusCode.FAILED: {
        this.onFailed()
        break;
      }
    }
  }
}
