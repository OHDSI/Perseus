import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scan-data',
  templateUrl: './scan-data.component.html',
  styleUrls: ['./scan-data.component.scss', 'scan-data-normalize.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ScanDataComponent>) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
