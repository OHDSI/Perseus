import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TableToScan } from '../../model/table-to-scan';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { ConnectionResult } from '../../model/connection-result';
import { takeUntil } from 'rxjs/operators';
import { ScanParams } from '../../model/scan-params';

@Component({
  selector: 'app-tables-to-scan',
  templateUrl: './tables-to-scan.component.html',
  styleUrls: ['./tables-to-scan.component.scss', '../../styles/scan-data-step.scss', '../../styles/scan-data-normalize.scss', '../../styles/scan-data-popup.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablesToScanComponent implements OnInit, OnDestroy {

  @Input()
  scanParams: ScanParams;

  @Input()
  tablesToScan: TableToScan[];

  @Input()
  filteredTablesToScan: TableToScan[];

  @Input()
  connectionResult: ConnectionResult;

  showScanParamsPopup = false;

  scanParamsForm: FormGroup;

  searchTableName = '';

  private destroy$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initScanParamsForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCheckTable(checkedTable: TableToScan): void {
    this.filteredTablesToScan = this.filteredTablesToScan
      .map(table => table.tableName === checkedTable.tableName ?
        this.changeValueInAllTablesAndReturn(checkedTable) : table
      );
  }

  onSelectAll(): void {
    this.filteredTablesToScan = this.filteredTablesToScan
      .map(table => !table.selected ?
        this.changeValueInAllTablesAndReturn({tableName: table.tableName, selected: true}) : table
      );
  }

  onDeselectAll(): void {
    this.filteredTablesToScan = this.filteredTablesToScan
      .map(table => table.selected ?
        this.changeValueInAllTablesAndReturn({tableName: table.tableName, selected: false}) : table
      );
  }

  onSearchByTableName(value: string) {
    this.searchTableName = value;
    const name = this.searchTableName.toLowerCase();
    this.filteredTablesToScan = this.tablesToScan.filter(table => table.tableName
      .toLowerCase()
      .includes(name)
    );
  }

  reset(): void {
    this.searchTableName = '';
  }

  private initScanParamsForm(): void {
    const {sampleSize, scanValues, minCellCount, maxValues, calculateNumericStats, numericStatsSamplerSize} = this.scanParams;

    this.scanParamsForm = this.formBuilder.group({
      sampleSize: {value: sampleSize, disabled: scanValues},
      scanValues,
      minCellCount: {value: minCellCount, disabled: scanValues},
      maxValues: {value: maxValues, disabled: scanValues},
      calculateNumericStats,
      numericStatsSamplerSize: {value: numericStatsSamplerSize, disabled: calculateNumericStats}
    });

    this.scanParamsForm.get('calculateNumericStats').valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(value => value ?
        this.scanParamsForm.get('numericStatsSamplerSize').enable() : this.scanParamsForm.get('numericStatsSamplerSize').disable());

    const controlsDependentOnScanValues = ['sampleSize', 'minCellCount', 'maxValues'];
    this.scanParamsForm.get('scanValues').valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (value) {
          controlsDependentOnScanValues.forEach(control =>
            this.scanParamsForm.get(control).enable()
          );
        } else {
          controlsDependentOnScanValues.forEach(control =>
            this.scanParamsForm.get(control).disable()
          );
        }
      });
  }

  private changeValueInAllTablesAndReturn(newValue: TableToScan): TableToScan {
    this.tablesToScan = this.tablesToScan
      .map(table => table.tableName === newValue.tableName ? newValue : table);

    return newValue;
  }
}
