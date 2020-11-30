import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connection-error-popup',
  templateUrl: './connection-error-popup.component.html',
  styleUrls: ['./connection-error-popup.component.scss', '../../styles/scan-data-normalize.scss']
})
export class ConnectionErrorPopupComponent implements OnInit {

  message: string;

  constructor(private dialogRef: MatDialogRef<ConnectionErrorPopupComponent>,
              @Inject(MAT_DIALOG_DATA) private data: string) { }

  ngOnInit(): void {
    this.message = this.data;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
