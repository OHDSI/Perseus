import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.scss']
})
export class WarningPopupComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {header: string, message: string},
              public dialogRef: MatDialogRef<WarningPopupComponent>) {
  }
}
