import { Component, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { IConnector } from 'src/app/models/interface/connector.interface';

@Component({
  selector: 'app-set-connection-type-popup',
  templateUrl: './set-connection-type-popup.component.html',
  styleUrls: [ './set-connection-type-popup.component.scss' ]
})
export class SetConnectionTypePopupComponent implements OnInit {
  @Output() transformationCreated = new EventEmitter<string>();

  sqlLabel = 'SQL Function';
  lookupLabel = 'Lookup';
  connector: IConnector;
  constructor(public dialogRef: OverlayDialogRef,
              @Inject(OVERLAY_DIALOG_DATA) public payload: any) {}

  ngOnInit() {
    this.connector = this.payload.connector;
  }

  openSqlFunctionDialog() {
    this.dialogRef.close({ connectionType: 'T' });
  }

  openLookupDialog() {
    this.dialogRef.close({ connectionType: 'L' });
  }

  onSqlChecked(isChecked: boolean){
    this.connector.source.sqlTransformationActive = isChecked;
  }

}
