import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelComponent } from './panel.component';
import { PanelTableComponent } from './panel-table/panel-table.component';

@NgModule({
  declarations: [
    PanelComponent,
    PanelTableComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PanelModule { }
