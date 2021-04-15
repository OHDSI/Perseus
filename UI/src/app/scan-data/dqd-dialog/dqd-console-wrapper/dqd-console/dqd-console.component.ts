import { Component } from '@angular/core';
import { ConsoleComponent } from '../../../shared/scan-console-wrapper/console/console.component';
import { DqdWebsocketService } from '../../../../websocket/dqd/dqd-websocket.service';
import { ProgressNotification, ProgressNotificationStatusCode } from '../../../model/progress-notification';
import { DqdService } from '../../../../services/dqd.service';

@Component({
  selector: 'app-dqd-console',
  templateUrl: '../../../shared/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../shared/scan-console-wrapper/console/console.component.scss'],
  providers: [DqdWebsocketService]
})
export class DqdConsoleComponent extends ConsoleComponent {

  private readonly checkCount = 22;

  private checkedCount = 0;

  constructor(private dqdWebsocketService: DqdWebsocketService, private dqdService: DqdService) {
    super(dqdWebsocketService);
  }

  protected handleProgressMessage(message: any): void {
    const notification = JSON.parse(message) as ProgressNotification;
    const status = parseInt(notification.status as string, 10);

    this.showNotificationMessage(notification);
    this.scrollToConsoleBottom();

    switch (status) {
      case ProgressNotificationStatusCode.IN_PROGRESS: {
        this.progressValue = ++this.checkedCount / this.checkCount * 100;
        break;
      }
      case ProgressNotificationStatusCode.FINISHED: {
        this.progressValue = 100;
        this.getResult();
        break;
      }
      case ProgressNotificationStatusCode.FAILED: {
        this.progressValue = 0;
        this.websocketService.disconnect();
        break;
      }
    }
  }

  private getResult(): void {
    this.dqdService.getResult(this.dqdWebsocketService.userId)
      .subscribe(result => {
        if (result.successfully) {
          this.finish.emit(result.payload);
        } else {
          this.showNotificationMessage({
            message: result.payload
          });
        }
      });
  }
}
