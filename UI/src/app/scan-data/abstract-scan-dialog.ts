import { MatDialogRef } from '@angular/material/dialog';
import { WebsocketParams } from '@models/scan-data/websocket-params';
import { AbstractConsoleWrapperComponent } from './auxiliary/scan-console-wrapper/abstract-console-wrapper-component.directive';

/**
 * @deprecated Use ConversionDialog
 */
export abstract class AbstractScanDialog {

  websocketParams: WebsocketParams;

  private selectedIndex = 0;

  abstract consoleWrapperComponent: AbstractConsoleWrapperComponent<any>;

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
      this.dialogRef.updateSize('700px', '735px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
