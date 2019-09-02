import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-values-popup',
  templateUrl: './values-popup.component.html',
  styleUrls: ['./values-popup.component.scss']
})
export class ValuesPopupComponent {
  static data: any;

  items = [];

  constructor(private overlay: OverlayRef) {
    this.items = overlay.getConfig()['data'];

    this.overlay.backdropClick().subscribe(() => this.overlay.detach());
  }
}
