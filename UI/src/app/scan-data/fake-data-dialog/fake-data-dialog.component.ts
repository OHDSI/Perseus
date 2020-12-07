import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fake-data-dialog',
  templateUrl: './fake-data-dialog.component.html',
  styleUrls: ['./fake-data-dialog.component.scss', '../styles/scan-dialog.scss', '../styles/scan-data-normalize.scss']
})
export class FakeDataDialogComponent implements OnInit {

  selectedIndex = 0;

  constructor(private dialogRef: MatDialogRef<FakeDataDialogComponent>) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onGenerate(params: {maxRowCount: number, doUniformSampling: boolean}): void {
    const {maxRowCount, doUniformSampling} = params;

    this.selectedIndex = 1;
  }
}
