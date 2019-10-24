import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConceptService } from '../../comfy/services/concept.service';

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
    private conceptService: ConceptService,
    public dialogRef: MatDialogRef<MappingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sourceTables = data.source;
    this.targetTables = data.target;
    this.allTargetTables = data.allTarget;

    if (this.conceptService.isConceptTable(this.targetTables[0].name)) {
      this.targetTables = this.conceptService.getConceptTables(
        this.allTargetTables
      );
    }
  }
}
