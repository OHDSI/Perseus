import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { defaultRowHeight, getRowIndexByDataAttribute, getSelectionHeight, getSelectionTop } from './match-score-grid';

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
  editMapping = new EventEmitter<CodeMapping>()

  @ViewChild('sourceGridWrapper')
  sourceGridWrapper: ElementRef

  @ViewChild('matchScoreGridWrapper')
  matchScoreGridWrapper: ElementRef

  @ViewChild('targetGridWrapper')
  targetGridWrapper: ElementRef

  selectionTop = 0

  selectionHeight = 0

  editingMappingIndex = 0

  private gridHeaderHeight: number

  private gridTop: number

  private gridHeight = 0

  constructor(private importCodesService: ImportCodesService,
              private cdr: ChangeDetectorRef) {
    super();
  }

  get sourceData(): CodeMapping[] {
    return this.data
  }

  get matchScoreData(): number[] {
    return this.data.map(codeMapping => codeMapping.matchScore)
  }

  get targetData(): Concept[] {
    return this.data.flatMap((codeMapping, index) =>
      codeMapping.targetConcepts.map(targetConcept => ({
        ...targetConcept.concept,
        index
      }))
    )
  }

  get checkedAll() {
    return this.data.every(mapping => mapping.approved)
  }

  ngOnInit() {
    this.initColumns()

    this.data = this.importCodesService.codeMappings
    this.importCodesService.saveToStorage()
  }

  ngAfterViewInit() {
    setTimeout(() => { // Need set timeout to render page
      const grid = this.sourceGridWrapper.nativeElement as HTMLElement
      const gridHeader = grid.querySelector('[data-grid-header]')

      this.gridHeight = grid.getBoundingClientRect().height
      this.gridTop = grid.getBoundingClientRect().top
      this.gridHeaderHeight = gridHeader.getBoundingClientRect().height

      this.selectionTop = this.gridHeaderHeight
      this.selectionHeight = defaultRowHeight

      this.cdr.detectChanges()
    })
  }

  trackCodeMappings(index: number, item: CodeMapping): string {
    return item.sourceCode.code[this.importCodesService.sourceNameColumn].toString()
  }

  trackConcepts(index: number, item: Concept): string {
    return item.conceptId.toString()
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
    if (!cell) {
      return
    }

    let row = cell.closest('[data-row]') as HTMLElement // Find row
    let rowIndex = getRowIndexByDataAttribute(row)
    if (row?.dataset.hasOwnProperty('targetRow')) { // If found row - target row -> find match score row
      row = this.sourceGridWrapper.nativeElement.querySelector(`[data-source-row][data-row="${rowIndex}"]`)
      rowIndex = getRowIndexByDataAttribute(row)
    }

    if (row) {
      this.editingMappingIndex = rowIndex
      this.selectionTop = getSelectionTop(row, this.gridTop)
      this.selectionHeight = getSelectionHeight(this.data[rowIndex])
    }
  }

  onEditMapping(event: MouseEvent) {
    const selectBlock = (event.target as HTMLElement).closest('[data-select-block]')
    const topPosition = selectBlock.getBoundingClientRect().top
    const rows = this.sourceGridWrapper.nativeElement.querySelectorAll('[data-source-row]')
    let rowIndex = 0
    for (const row of rows) {
      if (row.getBoundingClientRect().bottom > topPosition) {
        break
      }
      rowIndex++
    }

    this.editMapping.emit(this.data[rowIndex])
  }

  isTermColumn(field: string) {
    return field === this.importCodesService.sourceNameColumn
  }

  rowHeight(index: number): number {
    return defaultRowHeight * this.data[index].targetConcepts.length
  }

  private initColumns() {
    this.sourceColumns = this.importCodesService.columns
    this.targetColumns = targetColumns

    this.sourceDisplayedColumns = ['__select__', ...this.sourceColumns.map(columnToField)]
    this.matchScoreDisplayedColumns = ['matchScore']
    this.targetDisplayedColumns = ['__edit__', ...this.targetColumns.map(columnToField)]
  }
}
