import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransformationConfig } from '../model/transformation-config';
import { DictionaryItem } from '../../vocabulary-dropdown/model/vocabulary';
import { VocabularyConditionComponent } from '../vocabulary-condition/vocabulary-condition.component';

@Component({
  selector: 'app-condition-dialog',
  templateUrl: './condition-dialog.component.html',
  styleUrls: ['./condition-dialog.component.scss']
})
export class ConditionDialogComponent implements OnInit {
  config: TransformationConfig;
  sourceFields: DictionaryItem[];
  condition: any;

  constructor(
    public dialogRef: MatDialogRef<ConditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.config = data.config;
    this.sourceFields = data.sourceFields.map(
      columnName => new DictionaryItem(columnName)
    );
  }

  ngOnInit() {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onDoneClick(conditionComponent: VocabularyConditionComponent): void {
    this.condition = conditionComponent.result;
    this.data.result = this.condition;
    this.dialogRef.close();
  }

  onConditionInput(condition: any): void {
    this.condition = condition;
  }
}

