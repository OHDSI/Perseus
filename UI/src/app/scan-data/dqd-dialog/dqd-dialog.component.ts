import { Component, ViewChild } from '@angular/core';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DqdConsoleWrapperComponent } from './dqd-console-wrapper/dqd-console-wrapper.component';
import { DbSettings } from '../model/db-settings';
import { dqdWsUrl } from '../../app.constants';

@Component({
  selector: 'app-dqd-dialog',
  templateUrl: './dqd-dialog.component.html',
  styleUrls: [
    './dqd-dialog.component.scss',
    '../styles/scan-dialog.scss',
    '../styles/scan-data-normalize.scss'
  ]
})
export class DqdDialogComponent extends AbstractScanDialog {

  @ViewChild(DqdConsoleWrapperComponent)
  consoleWrapperComponent: DqdConsoleWrapperComponent;

  constructor(dialogRef: MatDialogRef<DqdDialogComponent>) {
    super(dialogRef);
  }

  onCheck(dbSettings: DbSettings): void {
    this.websocketParams = {
      url: dqdWsUrl,
      payload: dbSettings
    };
    this.index = 1;
  }

  protected changeSize() {
    if (this.index === 0) {
      this.dialogRef.updateSize('367px', '674px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
