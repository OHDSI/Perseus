import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SqlTransformMode } from '@models/transformation/sql-transform-mode';
import { VisualTransformationComponent } from '@mapping/sql-transformation/visual-transformation/visual-transformation.component';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { ManualTransformationComponent } from '@mapping/sql-transformation/manual-transformation/manual-transformation.component';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-sql-transformation',
  templateUrl: './sql-transformation.component.html',
  styleUrls: ['./sql-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SqlTransformationComponent implements OnInit {

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

  get sqlForTransformation(): SqlForTransformation {
    return this.sqlComponent.sql
  }

  get sqlComponent(): VisualTransformationComponent | ManualTransformationComponent {
    return this.mode === 'visual' ? this.visualTransformationComponent : this.manualTransformationComponent
  }

  @Input()
  set sql(value: SqlForTransformation) {
    this.sql$.next(value)
  }

  ngOnInit() {
    this.mode$ = this.sql$.pipe(
      map(sql => sql.mode ?? 'visual'),
      tap(mode => this.mode = mode)
    )
  }

  onModeChange(mode: SqlTransformMode) {
    if (mode === 'manual') {
      this.sql = {...this.visualTransformationComponent.sql, mode}
    } else {
      this.sql = {mode}
    }
  }
}
