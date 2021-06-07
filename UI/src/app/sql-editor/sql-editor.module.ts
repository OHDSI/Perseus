import { NgModule } from '@angular/core';
import { SqlEditorComponent } from './sql-editor.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    SqlEditorComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    SqlEditorComponent
  ]
})
export class SqlEditorModule { }
