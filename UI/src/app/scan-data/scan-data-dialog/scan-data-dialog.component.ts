import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WebsocketParams } from '../model/websocket-params';

@Component({
  selector: 'app-scan-data-dialog',
  templateUrl: './scan-data-dialog.component.html',
  styleUrls: ['./scan-data-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss']
})
export class ScanDataDialogComponent {

  websocketParams: WebsocketParams;

  selectedIndex = 0;

  constructor(private dialogRef: MatDialogRef<ScanDataDialogComponent>) {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCloseByDagger() {
    if (this.selectedIndex === 0) {
      this.onClose();
    }
  }

  onScanningCancel(): void {
    this.selectedIndex = 0;
  }

  onScanTables(websocketParams: WebsocketParams): void {
    this.websocketParams = websocketParams;
    this.selectedIndex = 1;
  }
}
