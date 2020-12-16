import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ConnectionResult } from '../../model/connection-result';
import { TableToScan } from '../../model/table-to-scan';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';
import { DbSettings, DbSettingsBuilder } from '../../model/db-settings';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TablesToScanComponent } from './tables-to-scan/tables-to-scan.component';
import { ScanParams } from '../../model/scan-params';
import { ScanDataStateService } from '../../../services/scan-data-state.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionErrorPopupComponent } from '../../shared/connection-error-popup/connection-error-popup.component';
import { ConnectFormComponent } from '../../shared/connect-form/connect-form.component';
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

  connectionResult: ConnectionResult;

  connecting = false;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  scanTables = new EventEmitter<WebsocketParams>();

  @ViewChild(ConnectFormComponent)
  connectFormComponent: ConnectFormComponent;

  @ViewChild(TablesToScanComponent)
  tablesToScanComponent: TablesToScanComponent;

  private testConnectionStrategies: {[key: string]: (settings: ScanSettings) => void} = {
    dbSettings: (settings: ScanSettings) => {
      const dbSettings = settings as DbSettings;
      dbSettings.dbType = this.connectFormComponent.dataType;

      this.connecting = true;

      this.whiteRabbitService.testConnection(dbSettings)
        .pipe(
          switchMap(connectionResult => {
            this.connectionResult = connectionResult;
            if (connectionResult.canConnect) {
              this.connectFormComponent.subscribeFormChange();
              return this.whiteRabbitService.tablesInfo(dbSettings);
            } else {
              this.showErrorPopup(connectionResult.message);
              return of([]);
            }
          }),
          tap(() => {
            this.connecting = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe(tablesToScan => {
          this.tablesToScan = tablesToScan;
          this.filteredTablesToScan = this.tablesToScan;
          this.cdr.detectChanges();
        }, error => {
          this.tablesToScan = [];
          this.filteredTablesToScan = this.tablesToScan;
          this.connectionResult = {canConnect: false, message: error.message};
          this.connecting = false;
          this.cdr.detectChanges();
          this.showErrorPopup(this.connectionResult.message);
        });

      this.tablesToScanComponent.reset();
    },

    fileSettings: (settings: ScanSettings) => {
      this.tablesToScanComponent.reset();
      this.connectionResult = {canConnect: true, message: ''};
      this.tablesToScan = this.connectFormComponent.filesToScan
        .map(fileToScan => ({
          tableName: fileToScan.fileName,
          selected: true
        }));
      this.filteredTablesToScan = this.tablesToScan;

      this.cdr.detectChanges();
    }
  };

  constructor(private whiteRabbitService: WhiteRabbitService,
              private stateService: ScanDataStateService,
              private cdr: ChangeDetectorRef,
              private matDialog: MatDialog,
              protected cdmStateService: CdmStateService) {
  }

  ngOnInit(): void {
    this.loadState();
  }

  ngOnDestroy() {
    this.saveState();
    this.saveDbSettingsToCdmDbSettings();
  }

  onTestConnection(scanSettings: ScanSettings): void {
    const strategy = this.getTestConnectionStrategy();
    strategy(scanSettings);
  }

  onScanTables(): void {
    const params = this.createWebSocketParams();
    this.scanTables.emit(params);
  }

  reset(): void {
    if (this.tablesToScan.length > 0) {
      this.tablesToScan = [];
    }
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
      dbSettings: this.connectFormComponent.dbSettingsForm.value,
      fileSettings: this.connectFormComponent.fileSettingsForm.value,
      scanParams: this.tablesToScanComponent.scanParams,
      tablesToScan: this.tablesToScanComponent.tablesToScan,
      filteredTablesToScan: this.tablesToScanComponent.filteredTablesToScan,
      filesToScan: this.connectFormComponent.filesToScan,
      connectionResult: this.connectionResult
    };
  }

  private showErrorPopup(message: string): void {
    this.matDialog.open(ConnectionErrorPopupComponent, {
      width: '502',
      height: '358',
      disableClose: true,
      panelClass: 'scan-data-dialog',
      data: message
    });
  }

  private createWebSocketParams(): WebsocketParams {
    let payload: ScanSettings;
    let destination: string;

    if (this.connectFormComponent.isDbSettings) {
      payload = new DbSettingsBuilder()
        .setDbType(this.connectFormComponent.dataType)
        .setDbSettings(this.connectFormComponent.dbSettingsForm.value)
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

  private getTestConnectionStrategy() {
    if (this.connectFormComponent.isDbSettings) {
      return this.testConnectionStrategies['dbSettings'];
    } else {
      return this.testConnectionStrategies['fileSettings'];
    }
  }

  private saveDbSettingsToCdmDbSettings() {
    const dbType = this.connectFormComponent.dataType;

    if (cdmBuilderDatabaseTypes.includes(dbType)) {
      this.cdmStateService.state = {
        ...this.cdmStateService.state,
        sourceDbSettings: {
          dbType,
          ...this.connectFormComponent.dbSettingsForm.value
        }
      };
    }
  }
}
