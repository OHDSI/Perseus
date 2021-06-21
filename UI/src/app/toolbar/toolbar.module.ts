import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrump.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ToolbarComponent,
    BreadcrumbComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
