import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'app-new-sql-transformation',
  templateUrl: './new-sql-transformation.component.html',
  styleUrls: ['./new-sql-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSqlTransformationComponent extends BaseComponent {

  mode: 'visual' | 'manual' = 'visual'
}
