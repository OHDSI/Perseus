import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { IConnector } from 'src/app/models/interface/connector.interface';

@Component({
  selector: 'app-set-connection-type-popup',
  templateUrl: './set-connection-type-popup.component.html',
  styleUrls: [ './set-connection-type-popup.component.scss' ]
})
export class SetConnectionTypePopupComponent {
  @Output() transformationCreated = new EventEmitter<string>();

  sqlLabel = 'SQL Function';
  lookupLabel = 'Lookup';
  isDisabledLookup;

  constructor(
    public dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public payload: any
    ) {
      this.isDisabledLookup = !this.payload.arrow.target.name.endsWith('concept_id');
    }

  openSqlFunctionDialog() {
    this.dialogRef.close({ connectionType: 'T' });
  }

  openLookupDialog() {
    this.dialogRef.close({ connectionType: 'L' });
  }

  toggleCheckbox() {
    this.payload.arrow.lookup.applied = !this.payload.arrow.lookup.applied;
  }

  toggleSqlCheckbox() {
    this.payload.arrow.sql.applied = !this.payload.arrow.sql.applied;
  }
}
