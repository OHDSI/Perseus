import { Component, ViewChild } from '@angular/core';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CdmConsoleWrapperComponent } from './cdm-console-wrapper/cdm-console-wrapper.component';
import { CdmSettings } from '@models/cdm-builder/cdm-settings';
import { DbTypes, fakeDataDbSettings } from '../scan-data.constants';
import { WebsocketParams } from '@models/scan-data/websocket-params';
import { StoreService } from '@services/store.service';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { adaptDestinationCdmSettings } from '@utils/cdm-adapter';
import { CdmStateService } from '@services/cdm-builder/cdm-state.service';

@Component({
  selector: 'app-cdm-dialog',
  templateUrl: './cdm-dialog.component.html',
  styleUrls: ['./cdm-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss']
})
export class CdmDialogComponent extends AbstractScanDialog {

  @ViewChild(CdmConsoleWrapperComponent)
  consoleWrapperComponent: CdmConsoleWrapperComponent;

  whiteRabbitWebsocketParams: WebsocketParams;

  dqdWebsocketParams: WebsocketParams;

  private cdmSettings: CdmSettings;

  constructor(dialogRef: MatDialogRef<CdmDialogComponent>,
              private storeService: StoreService,
              private cdmStateService: CdmStateService) {
    super(dialogRef);
  }

  get dataType() {
    return this.cdmStateService.sourceDataType
  }

  get showMySqlWarning() {
    return this.dataType === DbTypes.MYSQL
  }

  onConvert(cdmSettings: CdmSettings): void {
    this.cdmSettings = cdmSettings;
    this.websocketParams = {
      payload: cdmSettings
    };
    this.index = 1;
  }

  header() {
    switch (this.index) {
      case 0:
      case 1: {
        return 'Convert to CDM';
      }
      case 2: {
        return 'Fake Data Generation';
      }
      case 3: {
        return 'Data Quality Check';
      }
    }
  }

  onDataQualityCheck() {
    const dbSettings: DbSettings = adaptDestinationCdmSettings(this.cdmSettings);

    this.dqdWebsocketParams = {
      payload: dbSettings
    };
    this.index = 3;
  }

  async onGenerateFakeData(params: { maxRowCount: number, doUniformSampling: boolean }) {
    const {reportFile, source} = this.storeService.state;
    const itemsToScanCount = source.length;
    const fakeDataParams = {
      ...params,
      dbSettings: fakeDataDbSettings
    };

    this.whiteRabbitWebsocketParams = {
      payload: {
        params: fakeDataParams,
        report: reportFile
      },
      itemsToScanCount,
    };
    this.index = 2;
  }
}
