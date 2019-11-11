import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mapping-popup',
  templateUrl: './mapping-popup.component.html',
  styleUrls: ['./mapping-popup.component.scss'],
})
export class MappingPopupComponent {
  sourceTables = [];
  targetTables = [];
  allTargetTables = [];

  constructor(
    public dialogRef: MatDialogRef<MappingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sourceTables = data.source;
    this.targetTables = data.target;
    this.allTargetTables = data.allTarget;
  }
}
