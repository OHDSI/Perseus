import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { SqlTransformMode } from '@models/transformation/sql-transform-mode';
import { VisualTransformationComponent } from '@mapping/new-sql-transformation/visual-transformation/visual-transformation.component';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { SqlTransformationComponent } from '@mapping/sql-transformation/sql-transformation.component';

@Component({
  selector: 'app-new-sql-transformation',
  templateUrl: './new-sql-transformation.component.html',
  styleUrls: ['./new-sql-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSqlTransformationComponent {

  @Input()
  sql: SqlForTransformation

  @ViewChild('visualTransformation')
  visualTransformationComponent: VisualTransformationComponent

  @ViewChild('manualTransformation')
  manualTransformation: SqlTransformationComponent

  mode: SqlTransformMode = 'visual'

  get newSql(): SqlForTransformation {
    return this.mode === 'visual' ? {
      name: this.visualTransformationComponent.sql,
      functions: this.visualTransformationComponent.state
    } : {
      name: this.manualTransformation.sql.name
    };
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
