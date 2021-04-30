import { NgModule } from '@angular/core';
import { GridComponent } from './grid.component';
import { SelectableGridComponent } from './selectable-grid/selectable-grid.component';
import { GridCheckboxComponent } from './selectable-grid/grid-checkbox/grid-checkbox.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    GridComponent,
    SelectableGridComponent,
    GridCheckboxComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    GridComponent,
    SelectableGridComponent
  ]
})
export class GridModule { }
