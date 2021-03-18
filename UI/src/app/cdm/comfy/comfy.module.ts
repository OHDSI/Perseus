import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComfyComponent } from './comfy.component';
import { ComfyRoutingModule } from './comfy-routing.module';
import { CdmCommonModule } from '../../common/cdm-common.module';
import { ColumnsListComponent } from './columns-list/columns-list.component';
import { HighlightTableDirective } from './highlight-table/highlight-table.directive';
import { VocabularySearchModule } from '../../vocabulary-search/vocabulary-search.module';
import { SqlEditorModule } from '../../sql-editor/sql-editor.module';
import { PopupsModule } from '../../popups/popups.module';
import { ColumnInfoComponent } from './columns-list/column-info/column-info.component';
import { ScanDataModule } from '../../scan-data/scan-data.module';

@NgModule({
  declarations: [
    ComfyComponent,
    ColumnsListComponent,
    ColumnInfoComponent,
    HighlightTableDirective
  ],
  imports: [
    CommonModule,
    ComfyRoutingModule,
    CdmCommonModule,
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
