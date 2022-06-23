import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SUPPORT_EMAIL } from '@app/app.constants'

@Component({
  selector: 'app-server-error-popup',
  templateUrl: './server-error-popup.component.html',
  styleUrls: ['../server-error.component.scss']
})
export class ServerErrorPopupComponent {

  email = SUPPORT_EMAIL
  emailHref = `mailto:${SUPPORT_EMAIL}?Subject=Server Error`

  constructor(public dialogRef: MatDialogRef<ServerErrorPopupComponent>) {
  }
}
