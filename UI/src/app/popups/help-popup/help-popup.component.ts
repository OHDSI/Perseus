import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { appVersion, SUPPORT_EMAIL } from '@app/app.constants';

@Component({
  selector: 'app-help-popup',
  templateUrl: './help-popup.component.html',
  styleUrls: ['./help-popup.component.scss']
})
export class HelpPopupComponent {

  version = appVersion
  email = SUPPORT_EMAIL
  emailHref = `mailto:${SUPPORT_EMAIL}`

  constructor(public dialogRef: MatDialogRef<HelpPopupComponent>) {
  }
}
