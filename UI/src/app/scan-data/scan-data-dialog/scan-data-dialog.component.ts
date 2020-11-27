import { Component } from '@angular/core';
import { DbSettings } from '../model/db-settings';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scan-data-dialog',
  templateUrl: './scan-data-dialog.component.html',
  styleUrls: ['./scan-data-dialog.component.scss', '../styles/scan-data-normalize.scss']
})
export class ScanDataDialogComponent {

  dbSettings: DbSettings;

  selectedIndex = 0;

  constructor(private dialogRef: MatDialogRef<ScanDataDialogComponent>) {
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
