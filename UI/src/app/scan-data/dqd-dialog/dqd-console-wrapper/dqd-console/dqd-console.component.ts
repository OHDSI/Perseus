import { Component } from '@angular/core';
import { ConsoleComponent } from '../../../auxiliary/scan-console-wrapper/console/console.component';
import { DqdWebsocketService } from '../../../../websocket/dqd/dqd-websocket.service';
import { ProgressNotificationStatusCode, toFailedMessage } from '../../../../models/scan-data/progress-notification';
import { DqdService } from '../../../../services/data-quality-check/dqd.service';
import { parseHttpError } from '../../../../utilites/error';

@Component({
  selector: 'app-dqd-console',
  templateUrl: '../../../auxiliary/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../auxiliary/scan-console-wrapper/console/console.component.scss'],
  providers: [DqdWebsocketService]
})
export class DqdConsoleComponent extends ConsoleComponent<string> {

  private readonly checkCount = 22;

  private checkedCount = 0;

  constructor(private dqdWebsocketService: DqdWebsocketService, private dqdService: DqdService) {
    super(dqdWebsocketService);
  }

  protected handleProgressMessage(message: string): void {
    const notification = JSON.parse(message);
    const code = parseInt(notification.status, 10);
    this.showNotificationMessage({
      ...notification, status: {code}
    });

    switch (code) {
      case ProgressNotificationStatusCode.IN_PROGRESS: {
        this.progressValue = ++this.checkedCount / this.checkCount * 100;
        break;
      }
      case ProgressNotificationStatusCode.FINISHED: {
        this.dqdService.getResult(this.dqdWebsocketService.userId)
          .subscribe(
            ({successfully, payload}) => {
              if (successfully) {
                this.onSuccess(payload)
              } else {
                this.showNotificationMessage(toFailedMessage('Failed to generate data quality report'))
                this.onFailed()
              }
            },
            error => {
              this.showNotificationMessage(toFailedMessage(parseHttpError(error)))
              this.onFailed()
            }
          );
        break;
      }
      case ProgressNotificationStatusCode.FAILED: {
        this.onFailed()
        break;
      }
    }
  }
}
