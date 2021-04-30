import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportCodesComponent } from './import-codes/import-codes.component';
import { MappingCodesComponent } from './mapping-codes/mapping-codes.component';
import { CodeMappingRoutingModule } from './code-mapping-routing.module';
import { ImportVocabularyComponent } from './import-codes/import-vocabulary/import-vocabulary.component';
import { ImportVocabularyButtonsComponent } from './import-codes/import-vocabulary/import-vocabulary-buttons/import-vocabulary-buttons.component';
import { GridModule } from '../../grid/grid.module';
import { ImportCodesService } from '../../services/import-codes/import-codes.service';
import { ImportVocabulariesService } from '../../services/import-codes/import-vocabularies.service';
import { ColumnMappingFormComponent } from './import-codes/column-mapping/column-mapping-form/column-mapping-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnMappingFiltersComponent } from './import-codes/column-mapping/column-mapping-filters/column-mapping-filters.component';
import { SharedModule } from '../../shared/shared.module';
import { ColumnMappingComponent } from './import-codes/column-mapping/column-mapping.component';

@NgModule({
  declarations: [
    ImportCodesComponent,
    MappingCodesComponent,
    ImportVocabularyComponent,
    ImportVocabularyButtonsComponent,
    ColumnMappingFormComponent,
    ColumnMappingFiltersComponent,
    ColumnMappingComponent
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
