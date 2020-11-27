import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ConnectionResult } from '../../model/connection-result';
import { TableToScan } from '../../model/table-to-scan';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';
import { DbSettings, DbSettingsBuilder } from '../../model/db-settings';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TablesToScanComponent } from './tables-to-scan/tables-to-scan.component';
import { ScanParams } from '../../model/scan-params';
import { ScanDataStateService } from '../../../services/scan-data-state.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionErrorPopupComponent } from '../../shared/connection-error-popup/connection-error-popup.component';
import { DbConnectFromComponent } from '../../shared/db-connect-form/db-connect-from.component';

@Component({
  selector: 'app-scan-data-form',
  templateUrl: './scan-data-form.component.html',
  styleUrls: ['./scan-data-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataFormComponent implements OnInit {

  dbSettings: DbSettings;

  scanParams: ScanParams;

  tablesToScan: TableToScan[];

  filteredTablesToScan: TableToScan[];

  connectionResult: ConnectionResult;

  connecting = false;

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  scanTables = new EventEmitter<DbSettings>();

  @ViewChild(DbConnectFromComponent)
  sourceFormComponent: DbConnectFromComponent;

  @ViewChild(TablesToScanComponent)
  tablesToScanComponent: TablesToScanComponent;

  constructor(private whiteRabbitService: WhiteRabbitService,
              private stateService: ScanDataStateService,
              private cdr: ChangeDetectorRef,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadState();
  }

  onTestConnection(dbSettings: DbSettings): void {
    this.connecting = true;
    this.tablesToScanComponent.reset();
    this.whiteRabbitService.testConnection(dbSettings)
      .pipe(
        switchMap(connectionResult => {
          this.connectionResult = connectionResult;
          this.connecting = false;
          if (connectionResult.canConnect) {
            this.sourceFormComponent.subscribeFormChange();
            return this.whiteRabbitService.tablesInfo(dbSettings);
          } else {
            this.showErrorPopup(connectionResult.message);
            return of([]);
          }
        })
      )
      .subscribe(tablesToScan => {
        this.tablesToScan = tablesToScan;
        this.filteredTablesToScan = this.tablesToScan;
        this.cdr.detectChanges();
      }, error => {
        this.tablesToScan = [];
        this.filteredTablesToScan = this.tablesToScan;
        this.connecting = false;
        this.cdr.detectChanges();
      });
  }

  onScanTables(): void {
    this.saveState();

    const dbSettings = new DbSettingsBuilder()
      .setDbSettings(this.sourceFormComponent.form.value)
      .setScanParams(this.tablesToScanComponent.scanParams)
      .setTablesToScan(this.tablesToScanComponent.filteredTablesToScan)
      .build();

    this.scanTables.emit(dbSettings);
  }

  reset(): void {
    if (this.tablesToScan.length > 0) {
      this.tablesToScan = [];
    }
  }

  private loadState(): void {
    const state = this.stateService.state;

    this.dbSettings = state.dbSettings;
    this.scanParams = state.scanParams;
    this.tablesToScan = state.tablesToScan;
    this.filteredTablesToScan = state.filteredTablesToScan;
    this.connectionResult = state.connectionResult;
  }

  private saveState(): void {
    this.stateService.state = {
      dbSettings: this.sourceFormComponent.form.value,
      scanParams: this.tablesToScanComponent.scanParams,
      tablesToScan: this.tablesToScanComponent.tablesToScan,
      filteredTablesToScan: this.tablesToScanComponent.filteredTablesToScan,
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
}
