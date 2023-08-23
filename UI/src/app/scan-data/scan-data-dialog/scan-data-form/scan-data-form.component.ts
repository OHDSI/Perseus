import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConnectionResult } from '@models/white-rabbit/connection-result';
import { TableToScan } from '@models/white-rabbit/table-to-scan';
import { DbSettings, DbSettingsBuilder } from '@models/white-rabbit/db-settings';
import { TablesToScanComponent } from './tables-to-scan/tables-to-scan.component';
import { ScanDataParams } from '@models/white-rabbit/scan-data-params';
import { ScanDataStateService } from '@services/white-rabbit/scan-data-state.service';
import { ConnectFormComponent } from './connect-form/connect-form.component';
import { DelimitedTextFileSettingsBuilder, FilesSettings } from '@models/white-rabbit/files-settings';
import { ScanSettings } from '@models/white-rabbit/scan-settings';
import { cdmBuilderDatabaseTypes } from '../../scan-data.constants';
import { CdmStateService } from '@services/cdm-builder/cdm-state.service';
import { ScanSettingsType } from '@models/white-rabbit/scan-settings-type'
import { DataConnectionService } from '@app/data-connection/data-connection.service';

@Component({
  selector: 'app-scan-data-form',
  templateUrl: './scan-data-form.component.html',
  styleUrls: ['./scan-data-form.component.scss', '../../styles/scan-data-buttons.scss']
})
export class ScanDataFormComponent implements OnInit, AfterViewInit, OnDestroy {

  dataType: string;

  dbSettings: DbSettings;

  fileSettings: FilesSettings;

  searchTableName: string

  scanParams: ScanDataParams;

  tablesToScan: TableToScan[];

  filteredTablesToScan: TableToScan[];

  filesToScan: File[];

  connectionResult: ConnectionResult;

  @Input()
  scanning: boolean;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  scanTables = new EventEmitter<{type: ScanSettingsType, settings: ScanSettings}>();

  @ViewChild(ConnectFormComponent)
  connectFormComponent: ConnectFormComponent;

  @ViewChild(TablesToScanComponent)
  tablesToScanComponent: TablesToScanComponent;

  scanTablesDisabled = () => true

  constructor(private stateService: ScanDataStateService,
              private cdmStateService: CdmStateService,
              private dataConnectionService: DataConnectionService,
  ) {
  }

  ngOnInit(): void {
    this.loadState();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scanTablesDisabled = () => {
      if (this.dataConnectionService.sourceConnection) {
        return !this.dataConnectionService.sourceConnection.validProfileRequest
      } else {
        return this.tablesToScanComponent.tablesToScan.filter(t => t.selected).length === 0
      }
    })
  }

  ngOnDestroy(): void {
    this.saveState();
    this.saveCdmDbSettingsState();
  }

  onScanTables(): void {
    const settings = this.createSettings();
    this.scanTables.emit(settings);
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

  private createSettings(): {type: ScanSettingsType, settings: ScanSettings} {
    let type: ScanSettingsType
    let settings: ScanSettings
    // if (this.connectFormComponent.isDataConnection) {
    //  type = ScanSettingsType.DATA_CONNECTION
    //  settings = {
    //    dataConnectionService: this.dataConnectionService
    //  }
    // } else 
    
    if (this.connectFormComponent.isDbSettings) {
      type = ScanSettingsType.DB
      settings = new DbSettingsBuilder()
        .setDbType(this.connectFormComponent.dataType)
        .setDbSettings(this.connectFormComponent.form.value)
        .setScanParams(this.tablesToScanComponent.scanParams)
        .setTablesToScan(this.tablesToScanComponent.filteredTablesToScan)
        .build()
    } else {
      type = ScanSettingsType.FILES
      settings = new DelimitedTextFileSettingsBuilder()
        .setFileType(this.connectFormComponent.dataType)
        .setFileSettings(this.connectFormComponent.fileSettingsForm.value)
        .setScanParams(this.tablesToScanComponent.scanParams)
        .setTableToScan(this.tablesToScanComponent.filteredTablesToScan)
        .setFilesToScan(this.connectFormComponent.filesToScan)
        .build()
    }
    return {type, settings}
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
}
