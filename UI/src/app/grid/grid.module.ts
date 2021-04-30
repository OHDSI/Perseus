import { NgModule } from '@angular/core';
import { GridComponent } from './grid.component';
import { SelectableGridComponent } from './selectable-grid/selectable-grid.component';
import { GridCheckboxComponent } from './selectable-grid/grid-checkbox/grid-checkbox.component';
import { SharedModule } from '../shared/shared.module';
import { GridColumnComponent } from './grid-column/grid-column.component';

@NgModule({
  declarations: [
    GridComponent,
    SelectableGridComponent,
    GridCheckboxComponent,
    GridColumnComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    GridComponent,
    SelectableGridComponent,
    GridCheckboxComponent,
    GridColumnComponent
  ]
})
export class GridModule { }
