import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-data-base-exist-warning-popup',
  templateUrl: './data-base-exist-warning-popup.component.html',
  styleUrls: [
    './data-base-exist-warning-popup.component.scss',
    '../../styles/scan-data-buttons.scss',
    '../../styles/scan-data-normalize.scss'
  ]
})
export class DataBaseExistWarningPopupComponent {

  constructor(private dialogRef: MatDialogRef<DataBaseExistWarningPopupComponent>) { }

  onCancel() {
    this.dialogRef.close(false);
  }

  onContinue() {
    this.dialogRef.close(true);
  }
}
