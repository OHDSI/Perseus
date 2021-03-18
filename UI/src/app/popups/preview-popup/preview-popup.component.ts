import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.scss']
})
export class PreviewPopupComponent implements OnInit {
  get tables(): string[] {
    return Object.keys(this.data);
  }

  constructor(
    public dialogRef: MatDialogRef<PreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.data[Object.keys(this.data)[0]] = (Object.values(this.data)[0] as string)
      .replace(/&quot;/gi, '\"');
  }
}
