import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-server-not-responding-popup',
  templateUrl: './server-not-responding-popup.component.html',
  styleUrls: ['../server-error.component.scss']
})
export class ServerNotRespondingPopupComponent {

  constructor(public dialogRef: MatDialogRef<ServerNotRespondingPopupComponent>) {
  }
}
