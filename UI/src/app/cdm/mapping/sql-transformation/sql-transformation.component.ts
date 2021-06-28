import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SqlTransformMode } from '@models/transformation/sql-transform-mode';
import { VisualTransformationComponent } from '@mapping/sql-transformation/visual-transformation/visual-transformation.component';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { ManualTransformationComponent } from '@mapping/sql-transformation/manual-transformation/manual-transformation.component';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sql-transformation',
  templateUrl: './sql-transformation.component.html',
  styleUrls: ['./sql-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SqlTransformationComponent implements OnInit {

  sqlForTransform: SqlForTransformation

  sql$ = new ReplaySubject<SqlForTransformation>(1)

  mode$: Observable<SqlTransformMode>

  mode: SqlTransformMode

  @ViewChild('visualTransformation')
  visualTransformationComponent: VisualTransformationComponent

  @ViewChild('manualTransformation')
  manualTransformationComponent: ManualTransformationComponent

  @Input()
  sourceFields: string

  @Input()
  functionsHeight = 236

  private modeChanged: boolean

  get sqlForTransformation(): SqlForTransformation {
    return this.sqlComponent.sql
  }

  get sqlComponent(): VisualTransformationComponent | ManualTransformationComponent {
    return this.mode === 'visual' ? this.visualTransformationComponent : this.manualTransformationComponent
  }

  get dirty() {
    return this.modeChanged || this.visualTransformationComponent?.dirty || this.manualTransformationComponent?.dirty
  }

  @Input()
  set sql(value: SqlForTransformation) {
    this.sqlForTransform = value
    this.sql$.next(value)
  }

  ngOnInit() {
    this.mode$ = this.sql$.pipe(
      map(sql => sql.mode ?? 'visual'),
      tap(mode => this.mode = mode)
    )
  }

  onModeChange(mode: SqlTransformMode) {
    this.modeChanged = true
    if (mode === 'manual') {
      this.sql = {...this.visualTransformationComponent.sql, mode}
    } else {
      this.sql = {mode}
    }
  }
}
