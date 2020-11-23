import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ConnectionResult } from '../model/connection-result';
import { TableToScan } from '../model/table-to-scan';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';
import { DbSettings } from '../model/db-settings';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SourceFormComponent } from './source-form/source-form.component';
import { TablesToScanComponent } from './tables-to-scan/tables-to-scan.component';

@Component({
  selector: 'app-scan-data-form',
  templateUrl: './scan-data-form.component.html',
  styleUrls: ['./scan-data-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataFormComponent implements OnInit {

  connectionResult: ConnectionResult = null;

  tablesToScan: TableToScan[] = [];
  filteredTablesToScan: TableToScan[] = [];

  connecting = false;

  @Output()
  cancel = new EventEmitter<void>();

  @ViewChild(SourceFormComponent)
  sourceFormComponent: SourceFormComponent;

  @ViewChild(TablesToScanComponent)
  tablesToScanComponent: TablesToScanComponent;

  constructor(private whiteRabbitService: WhiteRabbitService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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
            // todo open popup window with error message
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

  reset(): void {
    if (this.tablesToScan.length > 0) {
      this.tablesToScan = [];
    }
  }

  scanTables(): void {
    console.log(this.tablesToScanComponent.filteredTablesToScan);
  }
}
