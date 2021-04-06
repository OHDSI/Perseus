import { Component, ViewChild } from '@angular/core';
import { AbstractScanDialog } from '../abstract-scan-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CdmConsoleWrapperComponent } from './cdm-console-wrapper/cdm-console-wrapper.component';
import { CdmSettings } from '../model/cdm-settings';
import { cdmWebsocketConfig, fakeDataDbSettings, whiteRabbitWebsocketConfig } from '../scan-data.constants';
import { FakeDataParams } from '../model/fake-data-params';
import { WebsocketParams } from '../model/websocket-params';
import { fileToBase64 } from '../../services/utilites/base64-util';
import { StoreService } from '../../services/store.service';
import { dqdWsUrl } from '../../app.constants';
import { DbSettings } from '../model/db-settings';
import { adaptDestinationCdmSettings } from '../util/cdm-adapter';

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

  constructor(dialogRef: MatDialogRef<CdmDialogComponent>, private storeService: StoreService) {
    super(dialogRef);
  }

  onConvert(cdmSettings: CdmSettings): void {
    this.cdmSettings = cdmSettings;
    this.websocketParams = {
      ...cdmWebsocketConfig,
      endPoint: '',
      resultDestination: '',
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
      url: dqdWsUrl,
      payload: dbSettings
    };
    this.index = 3;
  }

  async onGenerateFakeData(params: FakeDataParams) {
    const state = this.storeService.state;
    const scanReportBase64 = (await fileToBase64(state.reportFile)).base64;
    const itemsToScanCount = state.source.length;
    const fakeDataParams: FakeDataParams = {
      ...params,
      scanReportBase64,
      dbSettings: fakeDataDbSettings
    };

    this.whiteRabbitWebsocketParams = {
      ...whiteRabbitWebsocketConfig,
      endPoint: '/fake-data',
      payload: fakeDataParams,
      itemsToScanCount,
      resultDestination: '/user/queue/fake-data'
    };

    this.index = 2;
  }
}
