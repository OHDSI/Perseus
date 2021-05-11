import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelectableGridComponent } from '../../../../grid/selectable-grid/selectable-grid.component';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { Column, columnToField } from '../../../../models/grid/grid';
import { targetColumns } from './match-score-grid.columns';
import { Code } from '../../../../models/code-mapping/code';
import { Concept } from '../../../../models/code-mapping/concept';

@Component({
  selector: 'app-match-score-grid',
  templateUrl: './match-score-grid.component.html',
  styleUrls: [
    './match-score-grid.component.scss',
    '../../../../grid/grid.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchScoreGridComponent extends SelectableGridComponent<CodeMapping> implements OnInit, AfterViewInit {

  data: CodeMapping[] = []

  sourceColumns: Column[]

  targetColumns: Column[]

  sourceDisplayedColumns: string[]

  matchScoreDisplayedColumns: string[]

  targetDisplayedColumns: string[]

  @ViewChild('sourceGridWrapper')
  sourceGridWrapper: ElementRef

  @ViewChild('matchScoreGridWrapper')
  matchScoreGridWrapper: ElementRef

  @ViewChild('targetGridWrapper')
  targetGridWrapper: ElementRef

  private selectionTop = 34; // 34 - Grid header height

  private gridTop: number

  constructor(private importCodesService: ImportCodesService) {
    super();
  }

  get sourceData(): Code[] {
    return this.data.map(codeMapping => codeMapping.sourceCode.code)
  }

  get matchScoreData(): number[] {
    return this.data.map(codeMapping => codeMapping.matchScore)
  }

  get targetData(): Concept[] {
    return this.data.map(codeMapping => codeMapping.targetConcept.concept)
  }

  get selectionTopInPx() {
    return `${this.selectionTop}px`
  }

  ngOnInit() {
    this.initColumns()

    this.data = this.importCodesService.codeMappings

    this.checkedAll = this.data.every(row => row.selected)
  }

  ngAfterViewInit() {
    this.gridTop = this.sourceGridWrapper.nativeElement.getBoundingClientRect().top
  }

  onWheel(event: WheelEvent) {
    event.preventDefault()
    this.sourceGridWrapper.nativeElement.scrollTop += event.deltaY
    this.matchScoreGridWrapper.nativeElement.scrollTop += event.deltaY
    this.targetGridWrapper.nativeElement.scrollTop += event.deltaY
  }

  onMouseover(event: MouseEvent) {
    const cell = event.target as HTMLElement
    if (cell?.dataset.hasOwnProperty('cell')) {
      this.selectionTop = cell.getBoundingClientRect().top - this.gridTop
    }
  }

  private initColumns() {
    this.sourceColumns = this.importCodesService.columns
    this.targetColumns = targetColumns

    this.sourceDisplayedColumns = ['__select__', ...this.sourceColumns.map(columnToField)]
    this.matchScoreDisplayedColumns = ['matchScore']
    this.targetDisplayedColumns = [...this.targetColumns.map(columnToField)]
  }
}
