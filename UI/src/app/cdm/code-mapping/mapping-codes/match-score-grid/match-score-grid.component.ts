import { Component, OnInit } from '@angular/core';
import { SelectableGridComponent } from '../../../../grid/selectable-grid/selectable-grid.component';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { Column, columnToField } from '../../../../models/grid/grid';

@Component({
  selector: 'app-match-score-grid',
  templateUrl: './match-score-grid.component.html',
  styleUrls: [
    './match-score-grid.component.scss',
    '../../../../grid/grid.component.scss'
  ]
})
export class MatchScoreGridComponent extends SelectableGridComponent<CodeMapping> implements OnInit {

  data: CodeMapping[]

  columns: Column[]

  sourceColumns: Column[]

  targetColumns: Column[]

  constructor(private importCodesService: ImportCodesService) {
    super();
  }

  ngOnInit() {
    this.initDisplayedColumns()
  }

  private initDisplayedColumns() {
    this.sourceColumns = this.importCodesService.columns
    this.targetColumns = [
      {
        field: 'conceptId',
        name: 'Concept ID'
      },
      {
        field: 'conceptName',
        name: 'Concept Name'
      },
      {
        field: 'domain',
        name: 'Domain'
      },
      {
        field: 'conceptClass',
        name: 'Concept Class'
      },
      {
        field: 'vocabulary',
        name: 'Vocabulary'
      },
      {
        field: 'conceptCode',
        name: 'Concept Code'
      },
      {
        field: 'standardCode',
        name: 'Standard Code'
      }
    ]

    this.displayedColumns = [
      '__select__',
      ...this.sourceColumns.map(columnToField),
      'matchScore',
      ...this.targetColumns.map(columnToField)
    ]
  }
}
