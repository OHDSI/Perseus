import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConnectionResult } from '../../../models/scan-data/connection-result';
import { TableToScan } from '../../../models/scan-data/table-to-scan';
import { DbSettings, DbSettingsBuilder } from '../../../models/scan-data/db-settings';
import { TablesToScanComponent } from './tables-to-scan/tables-to-scan.component';
import { ScanParams } from '../../../models/scan-data/scan-params';
import { ScanDataStateService } from '../../../services/white-rabbit/scan-data-state.service';
import { ConnectFormComponent } from './connect-form/connect-form.component';
import {
  DelimitedTextFileSettings,
  DelimitedTextFileSettingsBuilder
} from '../../../models/scan-data/delimited-text-file-settings';
import { ScanSettings } from '../../../models/scan-data/scan-settings';
import { WebsocketParams } from '../../../models/scan-data/websocket-params';
import { cdmBuilderDatabaseTypes } from '../../scan-data.constants';
import { CdmStateService } from '../../../services/cdm-builder/cdm-state.service';

@Component({
  selector: 'app-scan-data-form',
  templateUrl: './scan-data-form.component.html',
  styleUrls: ['./scan-data-form.component.scss', '../../styles/scan-data-buttons.scss']
})
export class ScanDataFormComponent implements OnInit, AfterViewInit, OnDestroy {

  dataType: string;

  dbSettings: DbSettings;

  fileSettings: DelimitedTextFileSettings;

  searchTableName: string

  scanParams: ScanParams;

  tablesToScan: TableToScan[];

  filteredTablesToScan: TableToScan[];

  filesToScan: File[];

  connectionResult: ConnectionResult;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  scanTables = new EventEmitter<{dbName: string; params: WebsocketParams}>();

  @ViewChild(ConnectFormComponent)
  connectFormComponent: ConnectFormComponent;

  @ViewChild(TablesToScanComponent)
  tablesToScanComponent: TablesToScanComponent;

  scanTablesDisabled = () => true

  constructor(private stateService: ScanDataStateService,
              private cdmStateService: CdmStateService) {
  }

  ngOnInit(): void {
    this.loadState();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scanTablesDisabled = () =>
      this.tablesToScanComponent.tablesToScan.filter(t => t.selected).length === 0
    )
  }

  ngOnDestroy(): void {
    this.saveState();
    this.saveCdmDbSettingsState();
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
    const {dataType, dbSettings, fileSettings, scanParams, tablesToScan,
      filteredTablesToScan, searchTableName, filesToScan, connectionResult} = this.stateService.state;

    this.dataType = dataType;
    this.dbSettings = dbSettings;
    this.fileSettings = fileSettings;
    this.scanParams = scanParams;
    this.tablesToScan = tablesToScan;
    this.filteredTablesToScan = filteredTablesToScan;
    this.searchTableName = searchTableName;
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
      searchTableName: this.tablesToScanComponent.searchTableName,
      filesToScan: this.connectFormComponent.filesToScan,
      connectionResult: this.connectFormComponent.connectionResult
    };
  }

  private createWebSocketParams(): WebsocketParams {
    let payload: ScanSettings;

    payload = this.connectFormComponent.isDbSettings ?
      new DbSettingsBuilder()
      .setDbType(this.connectFormComponent.dataType)
      .setDbSettings(this.connectFormComponent.form.value)
      .setScanParams(this.tablesToScanComponent.scanParams)
      .setTablesToScan(this.tablesToScanComponent.filteredTablesToScan)
      .build() :
      new DelimitedTextFileSettingsBuilder()
      .setFileType(this.connectFormComponent.dataType)
      .setFileSettings(this.connectFormComponent.fileSettingsForm.value)
      .setScanParams(this.tablesToScanComponent.scanParams)
      .setTableToScan(this.tablesToScanComponent.filteredTablesToScan)
      .setFilesToScan(this.connectFormComponent.filesToScan)
      .build();

    return {
      payload,
      itemsToScanCount: payload.itemsToScanCount,
    };
  }

  private saveCdmDbSettingsState() {
    const dbType = this.connectFormComponent.dataType;

    if (!this.cdmStateService.isSet && cdmBuilderDatabaseTypes.includes(dbType)) {
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
