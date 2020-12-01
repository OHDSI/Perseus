import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ScanSettingsWrapper } from '../model/scan-settings-wrapper';

@Component({
  selector: 'app-scan-data-dialog',
  templateUrl: './scan-data-dialog.component.html',
  styleUrls: ['./scan-data-dialog.component.scss', '../styles/scan-data-normalize.scss']
})
export class ScanDataDialogComponent {

  scanSettings: ScanSettingsWrapper;

  selectedIndex = 0;

  constructor(private dialogRef: MatDialogRef<ScanDataDialogComponent>) {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onScanningCancel(): void {
    this.selectedIndex = 0;
  }

  onScanTables(scanSettings: ScanSettingsWrapper): void {
    this.scanSettings = scanSettings;
    this.selectedIndex = 1;
  }
}
