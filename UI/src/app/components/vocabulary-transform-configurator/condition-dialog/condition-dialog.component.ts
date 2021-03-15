import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  TransformationConfig,
  TransformationCondition
} from '../model/transformation-config';
import { DictionaryItem } from '../../vocabulary-search-select/model/vocabulary';
import { VocabularyConditionComponent } from '../vocabulary-condition/vocabulary-condition.component';

@Component({
  selector: 'app-condition-dialog',
  templateUrl: './condition-dialog.component.html',
  styleUrls: ['./condition-dialog.component.scss']
})
export class ConditionDialogComponent implements OnInit {
  config: TransformationConfig;
  sourceFields: string[];
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

