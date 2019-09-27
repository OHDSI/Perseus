import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OverlayRef } from '@angular/cdk/overlay';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';

@Component({
  selector: 'app-values-popup',
  templateUrl: './values-popup.component.html',
  styleUrls: ['./values-popup.component.scss']
})
export class ValuesPopupComponent {
  items = [];

  constructor(
    public dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public payload: any
  ) {
    this.items = [...payload.items];
  }
}
