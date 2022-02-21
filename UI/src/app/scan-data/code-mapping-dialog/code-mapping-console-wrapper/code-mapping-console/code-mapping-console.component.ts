import { Component, OnInit } from '@angular/core';
import { ConsoleComponent } from '../../../auxiliary/scan-console-wrapper/console/console.component';
import { CodeMappingWebsocketService } from '@websocket/code-mapping/code-mapping-websocket.service';
import {
  ProgressNotification,
  ProgressNotificationStatus,
  ProgressNotificationStatusCode,
  toFailedMessage
} from '@models/scan-data/progress-notification';
import { ImportCodesService } from '@services/usagi/import-codes.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { ImportCodesMediatorService } from '@services/usagi/import-codes-mediator.service';

@Component({
  selector: 'app-code-mapping-console',
  templateUrl: '../../../auxiliary/scan-console-wrapper/console/console.component.html',
  styleUrls: ['../../../auxiliary/scan-console-wrapper/console/console.component.scss'],
  providers: [CodeMappingWebsocketService]
})
export class CodeMappingConsoleComponent extends ConsoleComponent<void> implements OnInit {

  private completedStepsCount = 0
  private allStepsCount: number;

  constructor(codeMappingWebsocketService: CodeMappingWebsocketService,
              private importCodesService: ImportCodesService,
              private importCodesMediatorService: ImportCodesMediatorService) {
    super(codeMappingWebsocketService)
  }

  ngOnInit() {
    this.websocketService.connect()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        () => {},
        error =>
          this.handleProgressMessage(toFailedMessage(this.websocketService.handleError(error)))
      )

    // New codes or edit existed vocabulary
    this.allStepsCount = this.importCodesService.codes ? this.importCodesService.codes
      .filter(code => code.selected)
      .length + 1 : 3;
    // 1 - First step - index generation, next calculate score for code
    // 3 - Steps for edit existed vocabulary

    this.onConnect();
  }

  abortAndCancel() {
    this.importCodesMediatorService.onAbort$
      .pipe(
        finalize(() => this.websocketService.disconnect())
      )
      .subscribe()
  }

  protected handleProgressMessage(notification: ProgressNotification): void {
    const status = (notification.status as ProgressNotificationStatus).code
    this.showNotificationMessage(notification)

    switch (status) {
      case ProgressNotificationStatusCode.IN_PROGRESS: {
        this.progressValue = ++this.completedStepsCount / this.allStepsCount * 100;
        break;
      }
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

  protected onConnect(): void {
    this.scanningStarted = true;
    this.subscribeOnProgressMessages();
  }
}
