import { Component } from '@angular/core';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';

@Component({
  selector: 'app-set-connection-type-popup',
  templateUrl: './set-connection-type-popup.component.html',
  styleUrls: ['./set-connection-type-popup.component.scss']
})
export class SetConnectionTypePopupComponent {
  constructor(public dialogRef: OverlayDialogRef) {}

  click(connectionType: string) {
    this.dialogRef.close({connectionType});
  }
}
