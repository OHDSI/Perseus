import { Component, Output, EventEmitter } from '@angular/core';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';

@Component({
  selector: 'app-set-connection-type-popup',
  templateUrl: './set-connection-type-popup.component.html',
  styleUrls: [ './set-connection-type-popup.component.scss' ]
})
export class SetConnectionTypePopupComponent {
  @Output() transformationCreated = new EventEmitter<string>();

  sqlLabel = 'SQL Function';
  lookupLabel = 'Lookup';
  constructor(public dialogRef: OverlayDialogRef) { }

  openSqlFunctionDialog() {
    this.dialogRef.close({ connectionType: 'L' });
  }

  openLookupDialog() {
    this.dialogRef.close({ connectionType: 'L' });
  }

}
