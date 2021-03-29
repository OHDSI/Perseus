import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationGridComponent } from './navigation-grid/navigation-grid.component';

@NgModule({
  declarations: [
    GridComponent,
    NavigationGridComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    GridComponent,
    NavigationGridComponent
  ]
})
export class GridModule { }
