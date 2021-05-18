import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { SelectableGridComponent } from '../../../../grid/selectable-grid/selectable-grid.component';
import { CodeMapping } from '../../../../models/code-mapping/code-mapping';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { Column, columnToField } from '../../../../models/grid/grid';
import { targetColumns } from './match-score-grid.columns';
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

  @Output()
  editMapping = new EventEmitter<string>()

  @ViewChild('sourceGridWrapper')
  sourceGridWrapper: ElementRef

  @ViewChild('matchScoreGridWrapper')
  matchScoreGridWrapper: ElementRef

  @ViewChild('targetGridWrapper')
  targetGridWrapper: ElementRef

  private gridHeaderHeight: number

  private gridRowHeight: number

  private selectionTop = 0

  private gridTop: number

  private sourceNameColumn: string

  constructor(private importCodesService: ImportCodesService) {
    super();
  }

  get sourceData(): CodeMapping[] {
    return this.data
  }

  get matchScoreData(): number[] {
    return this.data.map(codeMapping => codeMapping.matchScore)
  }

  get targetData(): Concept[] {
    return this.data.map(codeMapping => codeMapping.targetConcepts[0].concept)
  }

  get selectionTopInPx() {
    return `${this.selectionTop}px`
  }

  get checkedAll() {
    return this.data.every(mapping => mapping.approved)
  }

  ngOnInit() {
    this.initColumns()

    this.data = this.importCodesService.codeMappings
    this.sourceNameColumn = this.importCodesService.sourceNameColumn
  }

  ngAfterViewInit() {
    setTimeout(() => { // Need set timeout to render page
      const gridEl = this.sourceGridWrapper.nativeElement
      const gridHeader = gridEl.querySelector('[data-grid-header]')
      const gridRow = gridEl.querySelector('[data-grid-row]')

      this.gridTop = gridEl.getBoundingClientRect().top
      this.gridHeaderHeight = gridHeader.getBoundingClientRect().height
      this.gridRowHeight = gridRow.getBoundingClientRect().height
      this.selectionTop = this.gridHeaderHeight
    })
  }

  select(row: CodeMapping) {
    row.approved = !row.approved
  }

  selectAll() {
    const value = !this.checkedAll
    this.data.forEach(row => row.approved = value)
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
      const rect = cell.getBoundingClientRect()
      this.selectionTop = rect.top - this.gridTop
    }
  }

  onEditMapping(event: MouseEvent) {
    const selectBlock = (event.target as HTMLElement).closest('[data-select-block]')
    const topPosition = selectBlock.getBoundingClientRect().top - this.gridTop - this.gridHeaderHeight
    const rowIndex = Math.round(topPosition / this.gridRowHeight)

    this.editMapping.emit(this.data[rowIndex].sourceCode.code[this.sourceNameColumn])
  }

  isTermColumn(field: string) {
    return field === this.importCodesService.sourceNameColumn
  }

  private initColumns() {
    this.sourceColumns = this.importCodesService.columns
    this.targetColumns = targetColumns

    this.sourceDisplayedColumns = ['__select__', ...this.sourceColumns.map(columnToField)]
    this.matchScoreDisplayedColumns = ['matchScore']
    this.targetDisplayedColumns = [...this.targetColumns.map(columnToField)]
  }
}
