import { MatDialogRef } from '@angular/material/dialog';
import { WebsocketParams } from './model/websocket-params';
import { AbstractConsoleWrapperComponent } from './shared/scan-console-wrapper/abstract-console-wrapper.component';

export abstract class AbstractScanDialog {

  websocketParams: WebsocketParams;

  selectedIndex = 0;

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

  onCancel(): void {
    this.selectedIndex = 0;
  }
}
