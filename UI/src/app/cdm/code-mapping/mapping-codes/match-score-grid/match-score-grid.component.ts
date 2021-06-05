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
import { defaultRowHeight, getRowIndexByDataAttribute, getSelectionTopAndHeight, } from './match-score-grid';
import { termFromTargetConcept } from '../../../../models/code-mapping/target-concept';

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

  // Top selection position relative grid
  selectionTop: number = defaultRowHeight

  selectionHeight = defaultRowHeight + 2 // 2 - borders

  editingMappingIndex = 0

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
        index,
        term: termFromTargetConcept(targetConcept)
      }))
    )
  }

  get checkedAll() {
    return this.data.every(mapping => mapping.approved)
  }

  ngOnInit() {
    this.initColumns()

    this.data = this.importCodesService.codeMappings
  }

  ngAfterViewInit() {
    setTimeout(() => { // Need set timeout to render page
      const grid = this.sourceGridWrapper.nativeElement as HTMLElement
      const gridWrapper = grid.closest('[data-grid-wrapper]')

      this.gridHeight = gridWrapper.getBoundingClientRect().height + 10 // 10 - scroll height
      this.gridTop = grid.getBoundingClientRect().top

      this.cdr.detectChanges()
    })
  }

  trackCodeMappings(index: number, item: CodeMapping): string {
    return item.sourceCode.code[this.importCodesService.sourceNameColumn].toString()
  }

  trackConcepts(index: number, item: Concept): string {
    return `${item.term}: ${item.conceptId}`
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
    let row = cell.closest('[data-row]') as HTMLElement
    if (!row) {
      return
    }
    const rowIndex = getRowIndexByDataAttribute(row)
    const targetRows = this.targetGridWrapper.nativeElement.querySelectorAll(`[data-target-row][data-row="${rowIndex}"]`)
    if (row.dataset.hasOwnProperty('targetRow')) { // If found row - target row -> set first target row
      row = targetRows[0]
    }
    const lastTargetRow = targetRows[targetRows.length - 1]
    const {top, height} = getSelectionTopAndHeight(row, lastTargetRow, this.gridTop, this.gridHeight)

    this.selectionTop = top
    this.selectionHeight = height
    this.editingMappingIndex = rowIndex
  }

  onEditMapping() {
    this.editMapping.emit(this.data[this.editingMappingIndex])
  }

  isTermColumn(field: string) {
    return field === this.importCodesService.sourceNameColumn
  }

  rowHeight(index: number): number {
    return defaultRowHeight * this.data[index].targetConcepts.length
  }

  targetBackgroundColor(index): string {
    return index % 2 === 0 ?  '#fff' : '#f2f7fc'
  }

  editCellBorder(concept: Concept) {
    const targetConcepts = this.data[concept.index].targetConcepts
    const lastTargetConcept = targetConcepts[targetConcepts.length - 1]
    const isLast = lastTargetConcept.concept.conceptId === concept.conceptId && termFromTargetConcept(lastTargetConcept) === concept.term
    return isLast ? '1px solid #E6E6E6' : 'none';
  }

  private initColumns() {
    this.sourceColumns = this.importCodesService.columns
    this.targetColumns = targetColumns

    this.sourceDisplayedColumns = ['__select__', ...this.sourceColumns.map(columnToField)]
    this.matchScoreDisplayedColumns = ['matchScore']
    this.targetDisplayedColumns = ['__edit__', ...this.targetColumns.map(columnToField)]
  }
}
