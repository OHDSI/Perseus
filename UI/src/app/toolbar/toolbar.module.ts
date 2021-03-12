import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrump.component';
import { CdmCommonModule } from '../common/cdm-common.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ToolbarComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    CdmCommonModule,
    RouterModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
