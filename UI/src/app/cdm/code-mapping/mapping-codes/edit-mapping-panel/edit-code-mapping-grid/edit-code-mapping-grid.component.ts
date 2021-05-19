import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ScoredConcept } from '../../../../../models/code-mapping/scored-concept';
import { NavigationGridComponent } from '../../../../../grid/navigation-grid/navigation-grid.component';
import { Column, columnToField } from '../../../../../models/grid/grid';
import { targetColumns } from '../../match-score-grid/match-score-grid.columns';

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

  columns: Column[] = [
    {
      field: 'match_score',
      name: 'Score'
    },
    {
      field: 'term',
      name: 'Term'
    },
    ...targetColumns
  ]

  @Input()
  set data(data: ScoredConcept[]) {
    this.gridData = data
  }

  get checkedAll() {
    return this.gridData.every(concept => concept.selected)
  }

  ngOnInit(): void {
    this.displayedColumns = [
      '__select__',
      ...this.columns.map(columnToField)
    ]
  }

  select(row: ScoredConcept) {
    row.selected = !row.selected
  }

  selectAll() {
    const value = !this.checkedAll
    this.gridData.forEach(row => row.selected = value)
  }
}
