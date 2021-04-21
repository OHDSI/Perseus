import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-server-error-popup',
  templateUrl: './server-error-popup.component.html',
  styleUrls: ['../server-error.component.scss']
})
export class ServerErrorPopupComponent {

  constructor(public dialogRef: MatDialogRef<ServerErrorPopupComponent>) {
  }
}
