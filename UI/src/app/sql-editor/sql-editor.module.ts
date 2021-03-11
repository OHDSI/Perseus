import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlEditorComponent } from './sql-editor.component';
import { CdmCommonModule } from '../common/cdm-common.module';

@NgModule({
  declarations: [
    SqlEditorComponent
  ],
  imports: [
    CommonModule,
    CdmCommonModule
  ],
  exports: [
    SqlEditorComponent
  ]
})
export class SqlEditorModule { }
