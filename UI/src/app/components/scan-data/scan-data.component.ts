import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DbSettings } from './model/db-settings';

@Component({
  selector: 'app-scan-data',
  templateUrl: './scan-data.component.html',
  styleUrls: ['./scan-data.component.scss', 'scan-data-normalize.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataComponent implements OnInit {

  dbSettings: DbSettings;

  constructor(private dialogRef: MatDialogRef<ScanDataComponent>) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
