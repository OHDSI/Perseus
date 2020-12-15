import { MatDialogRef } from '@angular/material/dialog';
import { WebsocketParams } from './model/websocket-params';
import { AbstractConsoleWrapperComponent } from './shared/scan-console-wrapper/abstract-console-wrapper.component';

export abstract class AbstractScanDialog {

  websocketParams: WebsocketParams;

  selectedIndex = 1;

  abstract consoleWrapperComponent: AbstractConsoleWrapperComponent;

  protected constructor(protected dialogRef: MatDialogRef<AbstractScanDialog>) {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCloseByDagger() {
    if (this.selectedIndex === 0 || this.consoleWrapperComponent.result) {
      this.onClose();
    }
  }

  onScanningCancel(): void {
    this.selectedIndex = 0;
  }

  onScanTables(websocketParams: WebsocketParams): void {
    this.websocketParams = websocketParams;
    this.selectedIndex = 1;
  }
}
