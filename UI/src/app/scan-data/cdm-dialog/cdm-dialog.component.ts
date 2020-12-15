import { Component, ViewChild } from '@angular/core';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CdmConsoleWrapperComponent } from './cdm-console-wrapper/cdm-console-wrapper.component';
import { CdmSettings } from '../model/cdm-settings';
import { cdmWebsocketConfig } from '../scan-data.constants';

@Component({
  selector: 'app-cdm-dialog',
  templateUrl: './cdm-dialog.component.html',
  styleUrls: ['./cdm-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss']
})
export class CdmDialogComponent extends AbstractScanDialog {

  @ViewChild(CdmConsoleWrapperComponent)
  consoleWrapperComponent: CdmConsoleWrapperComponent;

  constructor(dialogRef: MatDialogRef<CdmDialogComponent>) {
    super(dialogRef);
  }

  onConvert(cdmSettings: CdmSettings): void {
    this.websocketParams = {
      ...cdmWebsocketConfig,
      endPoint: '',
      resultDestination: '',
      payload: cdmSettings
    };

    this.selectedIndex = 1;
  }
}
