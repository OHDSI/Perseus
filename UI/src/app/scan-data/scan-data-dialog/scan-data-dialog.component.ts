import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { ScanConsoleWrapperComponent } from './scan-console-wrapper/scan-console-wrapper.component';
import { WebsocketParams } from '../model/websocket-params';

@Component({
  selector: 'app-scan-data-dialog',
  templateUrl: './scan-data-dialog.component.html',
  styleUrls: ['./scan-data-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss'],
})
export class ScanDataDialogComponent extends AbstractScanDialog {

  @ViewChild(ScanConsoleWrapperComponent)
  consoleWrapperComponent: ScanConsoleWrapperComponent;

  constructor(dialogRef: MatDialogRef<ScanDataDialogComponent>) {
    super(dialogRef);
  }

  onScanTables(websocketParams: WebsocketParams): void {
    this.websocketParams = websocketParams;
    this.index = 1;
  }

  protected changeSize() {
    if (this.index === 0) {
      this.dialogRef.updateSize('700px', '674px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
