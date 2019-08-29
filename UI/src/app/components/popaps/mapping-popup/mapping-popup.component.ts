import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mapping-popup',
  templateUrl: './mapping-popup.component.html',
  styleUrls: ['./mapping-popup.component.scss']
})
export class MappingPopupComponent implements OnInit {
  sourceTables = [];
  targetTables = [];

  constructor(
    public dialogRef: MatDialogRef<MappingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sourceTables = data.source;
    this.targetTables = data.target;
  }

  ngOnInit() {}
}
