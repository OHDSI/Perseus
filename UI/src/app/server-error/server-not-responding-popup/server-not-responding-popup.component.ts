import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SUPPORT_EMAIL } from '@app/app.constants'

@Component({
  selector: 'app-server-not-responding-popup',
  templateUrl: './server-not-responding-popup.component.html',
  styleUrls: ['../server-error.component.scss']
})
export class ServerNotRespondingPopupComponent {

  email = SUPPORT_EMAIL
  emailHref = `mailto:${SUPPORT_EMAIL}?Subject=Server Not Responding`

  constructor(public dialogRef: MatDialogRef<ServerNotRespondingPopupComponent>) {
  }
}
