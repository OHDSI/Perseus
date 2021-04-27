import { NgModule } from '@angular/core';
import { GridComponent } from './grid.component';
import { NavigationGridComponent } from './navigation-grid/navigation-grid.component';
import { SelectableGridComponent } from './selectable-grid/selectable-grid.component';
import { GridCheckboxComponent } from './selectable-grid/grid-checkbox/grid-checkbox.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    GridComponent,
    NavigationGridComponent,
    SelectableGridComponent,
    GridCheckboxComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    GridComponent,
    NavigationGridComponent,
    SelectableGridComponent
  ]
})
export class GridModule { }
