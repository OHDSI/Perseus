import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { ScanConsoleWrapperComponent } from './scan-console-wrapper/scan-console-wrapper.component';
import { WebsocketParams } from '@models/scan-data/websocket-params';
import { DbTypes } from '@scan-data/scan-data.constants';
import { ScanDataStateService } from '@services/white-rabbit/scan-data-state.service';

@Component({
  selector: 'app-scan-data-dialog',
  templateUrl: './scan-data-dialog.component.html',
  styleUrls: ['./scan-data-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss'],
})
export class ScanDataDialogComponent extends AbstractScanDialog {

  @ViewChild(ScanConsoleWrapperComponent)
  consoleWrapperComponent: ScanConsoleWrapperComponent;

  dbName: string;

  constructor(dialogRef: MatDialogRef<ScanDataDialogComponent>,
              private scanDataStateService: ScanDataStateService) {
    super(dialogRef);
  }

  get dataType() {
    return this.scanDataStateService.dataType
  }

  get showMySqlHint(): boolean {
    return this.dataType === DbTypes.MYSQL
  }

  onScanTables(payload: {dbName: string, params: WebsocketParams}): void {
    const {dbName, params} = payload;
    this.dbName = dbName;
    this.websocketParams = params;
    this.index = 1;
  }
}
