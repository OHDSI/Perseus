import { Component } from '@angular/core';
import { SelectableGridComponent } from '@grid/selectable-grid/selectable-grid.component';
import { Code } from '@models/code-mapping/code';

@Component({
  selector: 'app-import-codes-grid',
  templateUrl: '../../../../../grid/selectable-grid/selectable-grid.component.html',
  styleUrls: [
    'import-codes-grid.component.scss',
    '../../../../../grid/grid.component.scss',
    '../../../../../grid/selectable-grid/selectable-grid.component.scss'
  ]
})
export class ImportCodesGridComponent extends SelectableGridComponent<Code> {
  height: '100%'
}
