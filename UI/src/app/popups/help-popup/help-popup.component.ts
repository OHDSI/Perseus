import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-help-popup',
  templateUrl: './help-popup.component.html',
  styleUrls: ['./help-popup.component.scss']
})
export class HelpPopupComponent {

  constructor(public dialogRef: MatDialogRef<HelpPopupComponent>) {
  }
}
