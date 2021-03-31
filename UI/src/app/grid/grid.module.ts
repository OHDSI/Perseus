import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationGridComponent } from './navigation-grid/navigation-grid.component';
import { SelectableGridComponent } from './selectable-grid/selectable-grid.component';
import { GridCheckboxComponent } from './selectable-grid/grid-checkbox/grid-checkbox.component';

@NgModule({
  declarations: [
    GridComponent,
    NavigationGridComponent,
    SelectableGridComponent,
    GridCheckboxComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    GridComponent,
    NavigationGridComponent,
    SelectableGridComponent
  ]
})
export class GridModule { }
