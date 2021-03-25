import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [GridComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class GridModule { }
