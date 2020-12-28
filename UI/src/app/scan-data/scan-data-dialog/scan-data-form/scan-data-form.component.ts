import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ConnectionResult } from '../../model/connection-result';
import { TableToScan } from '../../model/table-to-scan';
import { DbSettings, DbSettingsBuilder } from '../../model/db-settings';
import { TablesToScanComponent } from './tables-to-scan/tables-to-scan.component';
import { ScanParams } from '../../model/scan-params';
import { ScanDataStateService } from '../../../services/scan-data-state.service';
import { ConnectFormComponent } from './connect-form/connect-form.component';
import { DelimitedTextFileSettings, DelimitedTextFileSettingsBuilder } from '../../model/delimited-text-file-settings';
import { ScanSettings } from '../../model/scan-settings';
import { FileToScan } from '../../model/file-to-scan';
import { WebsocketParams } from '../../model/websocket-params';
import { cdmBuilderDatabaseTypes, whiteRabbitWebsocketConfig } from '../../scan-data.constants';
import { CdmStateService } from '../../../services/cdm-state.service';

@Component({
  selector: 'app-scan-data-form',
  templateUrl: './scan-data-form.component.html',
  styleUrls: ['./scan-data-form.component.scss', '../../styles/scan-data-buttons.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataFormComponent implements OnInit, OnDestroy {

  dataType: string;

  dbSettings: DbSettings;

  fileSettings: DelimitedTextFileSettings;

  scanParams: ScanParams;

  tablesToScan: TableToScan[];

  filteredTablesToScan: TableToScan[];

  filesToScan: FileToScan[];

  connecting = false;

  connectionResult: ConnectionResult;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  scanTables = new EventEmitter<{dbName: string; params: WebsocketParams}>();

  @ViewChild(ConnectFormComponent)
  connectFormComponent: ConnectFormComponent;

  @ViewChild(TablesToScanComponent)
  tablesToScanComponent: TablesToScanComponent;

  constructor(private stateService: ScanDataStateService,
              private cdmStateService: CdmStateService) {
  }

  ngOnInit(): void {
    this.loadState();
  }

  ngOnDestroy() {
    this.saveState();
    this.saveDbSettingsToCdmDbSettings();
  }

  onScanTables(): void {
    const dbName = this.getDbName();
    const params = this.createWebSocketParams();
    this.scanTables.emit({dbName, params});
  }

  reset(): void {
    this.connectionResult = null;
    if (this.tablesToScan.length > 0) {
      this.tablesToScan = [];
    }
  }

  onConnectionResultChange(result: ConnectionResult) {
    this.connectionResult = result;
  }

  onTablesToScanChange(tables: TableToScan[]) {
    this.tablesToScanComponent.reset();
    this.tablesToScan = tables;
    this.filteredTablesToScan = tables;
  }

  private loadState(): void {
    const {dataType, dbSettings, fileSettings, scanParams,
      tablesToScan, filteredTablesToScan, filesToScan, connectionResult} = this.stateService.state;

    this.dataType = dataType;
    this.dbSettings = dbSettings;
    this.fileSettings = fileSettings;
    this.scanParams = scanParams;
    this.tablesToScan = tablesToScan;
    this.filteredTablesToScan = filteredTablesToScan;
    this.filesToScan = filesToScan;
    this.connectionResult = connectionResult;
  }

  private saveState(): void {
    this.stateService.state = {
      dataType: this.connectFormComponent.dataType,
      dbSettings: this.connectFormComponent.form.value,
      fileSettings: this.connectFormComponent.fileSettingsForm.value,
      scanParams: this.tablesToScanComponent.scanParams,
      tablesToScan: this.tablesToScanComponent.tablesToScan,
      filteredTablesToScan: this.tablesToScanComponent.filteredTablesToScan,
      filesToScan: this.connectFormComponent.filesToScan,
      connectionResult: this.connectFormComponent.connectionResult
    };
  }

  private createWebSocketParams(): WebsocketParams {
    let payload: ScanSettings;
    let destination: string;

    if (this.connectFormComponent.isDbSettings) {
      payload = new DbSettingsBuilder()
        .setDbType(this.connectFormComponent.dataType)
        .setDbSettings(this.connectFormComponent.form.value)
        .setScanParams(this.tablesToScanComponent.scanParams)
        .setTablesToScan(this.tablesToScanComponent.filteredTablesToScan)
        .build();

      destination = '/scan-report/db';
    } else {
      payload = new DelimitedTextFileSettingsBuilder()
        .setFileType(this.connectFormComponent.dataType)
        .setFileSettings(this.connectFormComponent.fileSettingsForm.value)
        .setScanParams(this.tablesToScanComponent.scanParams)
        .setTableToScan(this.tablesToScanComponent.filteredTablesToScan)
        .setFilesToScan(this.connectFormComponent.filesToScan)
        .build();

      destination = '/scan-report/file';
    }

    return {
      ...whiteRabbitWebsocketConfig,
      payload,
      endPoint: destination,
      itemsToScanCount: payload.itemsToScanCount,
      resultDestination: '/user/queue/scan-report'
    };
  }

  private saveDbSettingsToCdmDbSettings() {
    const dbType = this.connectFormComponent.dataType;

    if (cdmBuilderDatabaseTypes.includes(dbType)) {
      this.cdmStateService.state = {
        ...this.cdmStateService.state,
        sourceDbSettings: {
          dbType,
          ...this.connectFormComponent.form.value
        }
      };
    }
  }

  private getDbName() {
    if (this.connectFormComponent.isDbSettings) {
      return this.connectFormComponent.form.value.database;
    } else {
      return 'ScanReport';
    }
  }
}
