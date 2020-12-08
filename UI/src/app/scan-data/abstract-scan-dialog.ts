import { MatDialogRef } from '@angular/material/dialog';
import { WebsocketParams } from './model/websocket-params';
import { AbstractConsoleWrapperComponent } from './shared/scan-console-wrapper/abstract-console-wrapper.component';

export class AbstractScanDialog {

  websocketParams: WebsocketParams;

  selectedIndex = 0;

  // need to override in inherit component
  consoleWrapperComponent: AbstractConsoleWrapperComponent;

  constructor(protected dialogRef: MatDialogRef<AbstractScanDialog>) {
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
