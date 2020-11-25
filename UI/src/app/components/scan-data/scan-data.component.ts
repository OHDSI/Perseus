import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DbSettings } from './model/db-settings';

@Component({
  selector: 'app-scan-data',
  templateUrl: './scan-data.component.html',
  styleUrls: ['./scan-data.component.scss', 'styles/scan-data-normalize.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataComponent implements OnInit {

  dbSettings: DbSettings;

  selectedIndex = 0;

  constructor(private dialogRef: MatDialogRef<ScanDataComponent>) {
  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onScanningCancel(): void {
    this.selectedIndex = 0;
  }

  onScanTables(dbSettings: DbSettings): void {
    this.dbSettings = dbSettings;
    this.selectedIndex = 1;
  }
}
