import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { BridgeService } from 'src/app/services/bridge.service';
import { IConnection } from '@models/connection'

@Component({
  selector: 'app-choose-transformation-type-popup',
  templateUrl: './choose-transformation-type-popup.component.html',
  styleUrls: [ './choose-transformation-type-popup.component.scss' ]
})
export class ChooseTransformationTypePopupComponent {
  @Output() transformationCreated = new EventEmitter<string>();

  sqlLabel = 'SQL Function';
  lookupLabel = 'Lookup';
  isDisabledLookup;

  constructor(public dialogRef: OverlayDialogRef<{connectionType: 'L' | 'T'}>,
              private bridgeService: BridgeService,
              @Inject(OVERLAY_DIALOG_DATA) public payload: { arrow: IConnection }) {
    this.isDisabledLookup = !this.payload.arrow.target.name.endsWith('concept_id');
  }

  openSqlFunctionDialog() {
    this.dialogRef.close({ connectionType: 'T' });
  }

  openLookupDialog() {
    this.dialogRef.close({ connectionType: 'L' });
  }

  toggleLookupCheckbox() {
    this.payload.arrow.lookup.applied = !this.payload.arrow.lookup.applied;
    this.bridgeService.updateConnectedRows(this.payload.arrow);
  }

  toggleSqlCheckbox() {
    this.payload.arrow.sql.applied = !this.payload.arrow.sql.applied;
    this.bridgeService.updateConnectedRows(this.payload.arrow);
  }
}
