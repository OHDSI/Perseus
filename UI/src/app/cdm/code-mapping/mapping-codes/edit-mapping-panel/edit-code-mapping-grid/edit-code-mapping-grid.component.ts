import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ScoredConcept } from '@models/code-mapping/scored-concept';
import { NavigationGridComponent } from '@grid/navigation-grid/navigation-grid.component';
import { Column, columnToField } from '@models/grid/grid';
import { targetColumns } from '../../match-score-grid/match-score-grid.columns';
import { integerDivision } from '@utils/math';

@Component({
  selector: 'app-edit-code-mapping-grid',
  templateUrl: './edit-code-mapping-grid.component.html',
  styleUrls: [
    './edit-code-mapping-grid.component.scss',
    '../../../../../grid/grid.component.scss',
    '../../../../../grid/navigation-grid/navigation-grid.component.scss',
    '../../../../../grid/selectable-grid/selectable-grid.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCodeMappingGridComponent extends NavigationGridComponent<ScoredConcept> implements OnInit {

  gridData: ScoredConcept[] = []

  termColumns: Column[] = [
    {
      field: 'match_score',
      name: 'Score'
    },
    {
      field: 'term',
      name: 'Term'
    },
  ]

  showByValues = [
    {
      value: 10,
      viewValue: '10'
    },
    {
      value: 30,
      viewValue: '30'
    },
    {
      value: 50,
      viewValue: '50'
    },
    {
      value: 100,
      viewValue: '100'
    },
    {
      value: 500,
      viewValue: '500'
    }
  ];

  conceptColumns: Column[] = targetColumns

  @Input()
  set data(data: ScoredConcept[]) {
    this.gridData = data
    this.total = this.gridData.length
    this.currentPage = 1
    this.pageCount = integerDivision(this.total, this.pageSize)
  }

  get checkedAll() {
    return this.gridData.length && this.gridData.every(concept => concept.selected)
  }

  get startIndex() {
    return (this.currentPage - 1) * this.pageSize
  }

  get endIndex() {
    return Math.min(this.currentPage * this.pageSize, this.total)
  }

  ngOnInit(): void {
    this.columns = [
      ...this.termColumns,
      ...this.conceptColumns
    ]
    this.displayedColumns = [
      '__select__',
      ...this.columns.map(columnToField)
    ]
  }

  trackScoredConcept(index: number, item: ScoredConcept): string {
    return `${item.term[0]}: ${item.concept.conceptId}`
  }

  select(row: ScoredConcept) {
    row.selected = !row.selected
  }

  selectAll() {
    const value = !this.checkedAll
    this.gridData.forEach(row => row.selected = value)
  }

  handleNavigation(event: MouseEvent) {
    const needNavigation = this.needNavigation(event)

    if (needNavigation) {
      this.pagination.emit({
        pageNumber: this.currentPage,
        pageCount: this.pageCount
      })
    }
  }

  onPageSizeChange(event: number) {
    this.pageSize = event
    this.setPagesAndElementsCount(this.total, integerDivision(this.total, this.pageSize))
  }
}
