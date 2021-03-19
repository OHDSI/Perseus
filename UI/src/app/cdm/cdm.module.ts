import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdmComponent } from './cdm.component';
import { CdmCommonModule } from '../common/cdm-common.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { RouterModule } from '@angular/router';
import { CdmRoutingModule } from './cdm-routing.module';

@NgModule({
  declarations: [
    CdmComponent
  ],
  imports: [
    CommonModule,
    CdmCommonModule,
    ToolbarModule,
    RouterModule,
    CdmRoutingModule
  ],
  bootstrap: [
    CdmComponent
  ]
})
export class CdmModule { }
