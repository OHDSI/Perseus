import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-set-delimiter-dialog',
  templateUrl: './set-delimiter-dialog.component.html',
  styleUrls: ['./set-delimiter-dialog.component.scss']
})
export class SetDelimiterDialogComponent {

  delimiter = ','

  constructor(public dialogRef: MatDialogRef<SetDelimiterDialogComponent>) {
  }

  get disabled() {
    return !this.delimiter
  }

  onApply() {
    this.dialogRef.close(this.delimiter)
  }
}
