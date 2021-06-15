import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SqlTransformMode } from '@models/transformation/sql-transform-mode';
import { VisualTransformationComponent } from '@mapping/sql-transformation/visual-transformation/visual-transformation.component';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { ManualTransformationComponent } from '@mapping/sql-transformation/manual-transformation/manual-transformation.component';

@Component({
  selector: 'app-sql-transformation',
  templateUrl: './sql-transformation.component.html',
  styleUrls: ['./sql-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SqlTransformationComponent implements OnInit {

  @Input()
  sql: SqlForTransformation

  @ViewChild('visualTransformation')
  visualTransformationComponent: VisualTransformationComponent

  @ViewChild('manualTransformation')
  manualTransformation: ManualTransformationComponent

  mode: SqlTransformMode

  @Input()
  sourceFields: string

  @Input()
  functionsHeight = 236

  get sqlForTransformation(): SqlForTransformation {
    return this.mode === 'visual' ? {
      name: this.visualTransformationComponent.sql,
      functions: this.visualTransformationComponent.state,
      mode: this.mode
    } : {
      name: this.manualTransformation.sql.name,
      mode: this.mode
    };
  }

  ngOnInit() {
    this.mode = this.sql?.mode ?? 'visual'
  }

  onModeChange(mode: SqlTransformMode) {
    if (mode === 'manual') {
      this.sql = {
        name: this.visualTransformationComponent.sql
      }
    }

    this.mode = mode
  }
}
