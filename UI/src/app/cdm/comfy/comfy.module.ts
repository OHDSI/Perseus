import { NgModule } from '@angular/core';
import { ComfyComponent } from './comfy.component';
import { ComfyRoutingModule } from './comfy-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ColumnsListComponent } from './columns-list/columns-list.component';
import { HighlightTableDirective } from './highlight-table/highlight-table.directive';
import { VocabularySearchModule } from '@vocabulary-search/vocabulary-search.module';
import { SqlEditorModule } from '@app/sql-editor/sql-editor.module';
import { PopupsModule } from '@popups/popups.module';
import { ColumnInfoComponent } from './columns-list/column-info/column-info.component';
import { ScanDataModule } from '@scan-data/scan-data.module';

@NgModule({
  declarations: [
    ComfyComponent,
    ColumnsListComponent,
    ColumnInfoComponent,
    HighlightTableDirective
  ],
  imports: [
    ComfyRoutingModule,
    SharedModule,
    VocabularySearchModule,
    SqlEditorModule,
    PopupsModule,
    ScanDataModule
  ],
  bootstrap: [
    ComfyComponent
  ]
})
export class ComfyModule { }
