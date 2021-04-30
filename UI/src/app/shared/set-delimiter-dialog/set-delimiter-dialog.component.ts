import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-set-delimiter-dialog',
  templateUrl: './set-delimiter-dialog.component.html',
  styleUrls: ['./set-delimiter-dialog.component.scss']
})
export class SetDelimiterDialogComponent implements OnInit {

  delimiter = ','

  constructor(public dialogRef: MatDialogRef<SetDelimiterDialogComponent>) { }

  get disabled() {
    return !this.delimiter
  }

  ngOnInit(): void {
  }

  onApply() {
    this.dialogRef.close(this.delimiter)
  }
}
