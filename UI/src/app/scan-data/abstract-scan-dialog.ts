import { MatDialogRef } from '@angular/material/dialog';
import { WebsocketParams } from './model/websocket-params';
import { AbstractConsoleWrapperComponent } from './shared/scan-console-wrapper/abstract-console-wrapper.component';

export abstract class AbstractScanDialog {

  websocketParams: WebsocketParams;

  private selectedIndex = 0;

  abstract consoleWrapperComponent: AbstractConsoleWrapperComponent;

  protected constructor(protected dialogRef: MatDialogRef<AbstractScanDialog>) {
  }

  set index(value: number) {
    this.selectedIndex = value;
    this.changeSize();
  }

  get index() {
    return this.selectedIndex;
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
    this.index = 0;
  }

  protected changeSize() {
    if (this.index === 0) {
      this.dialogRef.updateSize('700px', '737px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
