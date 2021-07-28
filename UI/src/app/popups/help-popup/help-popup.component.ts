import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { appVersion } from '@app/app.constants';

@Component({
  selector: 'app-help-popup',
  templateUrl: './help-popup.component.html',
  styleUrls: ['./help-popup.component.scss']
})
export class HelpPopupComponent {

  version = appVersion

  constructor(public dialogRef: MatDialogRef<HelpPopupComponent>) {
  }
}
