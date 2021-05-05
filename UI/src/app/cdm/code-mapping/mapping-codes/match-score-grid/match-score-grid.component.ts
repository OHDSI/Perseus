import { Component, OnInit } from '@angular/core';
import { SelectableGridComponent } from '../../../../grid/selectable-grid/selectable-grid.component';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { Column, columnToField } from '../../../../models/grid/grid';
import { matchScoreColumn, targetColumns } from './match-score-grid.columns';
import { SourceConcept } from '../../../../models/code-mapping/source-concept';
import { TargetConcept } from '../../../../models/code-mapping/target-concept';

@Component({
  selector: 'app-match-score-grid',
  templateUrl: './match-score-grid.component.html',
  styleUrls: [
    './match-score-grid.component.scss',
    '../../../../grid/grid.component.scss'
  ]
})
export class MatchScoreGridComponent extends SelectableGridComponent<CodeMapping> implements OnInit {

  data: CodeMapping[] = []

  sourceColumns: Column[]

  matchScoreColumn: Column

  targetColumns: Column[]

  sourceDisplayedColumns: string[]

  matchScoreDisplayedColumns: string[]

  targetDisplayedColumns: string[]

  constructor(private importCodesService: ImportCodesService) {
    super();
  }

  get sourceData(): SourceConcept[] {
    return this.data.map(codeMapping => codeMapping.sourceConcept)
  }

  get matchScoreData(): {matchScore: number}[] {
    return this.data.map(codeMapping => ({matchScore: codeMapping.matchScore}))
  }

  get targetData(): TargetConcept[] {
    return this.data.map(codeMapping => codeMapping.targetConcept)
  }

  ngOnInit() {
    this.initDisplayedColumns()

    this.data = this.importCodesService.codeMappings
  }

  private initDisplayedColumns() {
    this.sourceColumns = this.importCodesService.columns
    this.matchScoreColumn = matchScoreColumn()
    this.targetColumns = targetColumns

    this.sourceDisplayedColumns = ['__select__', ...this.sourceColumns.map(columnToField)]
    this.matchScoreDisplayedColumns = [columnToField(this.matchScoreColumn)]
    this.targetDisplayedColumns = [...this.targetColumns.map(columnToField)]
  }
}
