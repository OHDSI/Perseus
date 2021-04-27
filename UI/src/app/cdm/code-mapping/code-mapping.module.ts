import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportCodesComponent } from './import-codes/import-codes.component';
import { MappingCodesComponent } from './mapping-codes/mapping-codes.component';
import { CodeMappingRoutingModule } from './code-mapping-routing.module';
import { ImportVocabularyComponent } from './import-codes/import-vocabulary/import-vocabulary.component';
import { ImportVocabularyButtonsComponent } from './import-codes/import-vocabulary/import-vocabulary-buttons/import-vocabulary-buttons.component';
import { VocabularyGridComponent } from './import-codes/vocabulary-grid/vocabulary-grid.component';
import { GridModule } from '../../grid/grid.module';
import { ImportCodesService } from './import-codes.service';
import { ImportVocabulariesService } from './import-vocabularies.service';
import { ColumnMappingPanelComponent } from './import-codes/auxiliary/column-mapping-panel/column-mapping-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnMappingFiltersComponent } from './import-codes/auxiliary/column-mapping-filters/column-mapping-filters.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ImportCodesComponent,
    MappingCodesComponent,
    ImportVocabularyComponent,
    ImportVocabularyButtonsComponent,
    VocabularyGridComponent,
    ColumnMappingPanelComponent,
    ColumnMappingFiltersComponent
  ],
  imports: [
    CommonModule,
    CodeMappingRoutingModule,
    SharedModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ImportCodesService,
    ImportVocabulariesService
  ]
})
export class CodeMappingModule { }
