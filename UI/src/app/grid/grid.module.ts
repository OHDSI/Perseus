import { NgModule } from '@angular/core';
import { SelectableGridComponent } from './selectable-grid/selectable-grid.component';
import { GridCheckboxComponent } from './selectable-grid/grid-checkbox/grid-checkbox.component';
import { SharedModule } from '@shared/shared.module';
import { GridColumnComponent } from './auxiliary/grid-column/grid-column.component';
import { NavigationGridComponent } from './navigation-grid/navigation-grid.component';

@NgModule({
  declarations: [
    SelectableGridComponent,
    GridCheckboxComponent,
    GridColumnComponent,
    NavigationGridComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    SelectableGridComponent,
    GridCheckboxComponent,
    GridColumnComponent,
    NavigationGridComponent
  ]
})
export class GridModule { }
