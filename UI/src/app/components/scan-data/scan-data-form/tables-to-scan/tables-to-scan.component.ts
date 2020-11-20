import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TableToScan } from '../../model/table-to-scan';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tables-to-scan',
  templateUrl: './tables-to-scan.component.html',
  styleUrls: ['./tables-to-scan.component.scss', '../../scan-data-step.scss', '../../scan-data-normalize.scss', './scan-params-popup.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablesToScanComponent implements OnInit {

  @Input()
  tablesToScan: TableToScan[];

  showScanParamsPopup = false;

  scanParamsForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initScanParamsForm();
  }

  onCheckTable(tableName: string): void {
    this.tablesToScan = this.tablesToScan
      .map(table => table.tableName === tableName ? {tableName, selected: !table.selected} : table);
  }

  onSelectAll(): void {
    this.tablesToScan = this.tablesToScan
      .map(table => table.selected ? table : {tableName: table.tableName, selected: true});
  }

  onDeselectAll(): void {
    this.tablesToScan = this.tablesToScan
      .map(table => !table.selected ? table : {tableName: table.tableName, selected: false});
  }

  private initScanParamsForm(): void {
    this.scanParamsForm = this.formBuilder.group({
      sampleSize: [100e3, [Validators.required]],
      scanValues: [true, [Validators.required]],
      minCellCount: [5, [Validators.required]],
      maxValues: [1e3, [Validators.required]],
      calculateNumericStats: [false, [Validators.required]],
      numericStatsSamplerSize: [100e3, [Validators.required]]
    });
  }
}
