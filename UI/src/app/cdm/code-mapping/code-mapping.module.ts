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
import { MatchScoreGridComponent } from './mapping-codes/match-score-grid/match-score-grid.component';
import { MappingCodesGuard } from '../../guards/code-mapping/mapping-codes.guard';
import { ImportCodesGuard } from '../../guards/code-mapping/import-codes.guard';
import { SaveVocabularyPopupComponent } from './mapping-codes/save-vocabulary-popup/save-vocabulary-popup.component';

@NgModule({
  declarations: [
    ImportCodesComponent,
    MappingCodesComponent,
    ImportVocabularyComponent,
    ImportVocabularyButtonsComponent,
    ColumnMappingFormComponent,
    ColumnMappingFiltersComponent,
    ColumnMappingComponent,
    MatchScoreGridComponent,
    SaveVocabularyPopupComponent
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
    ImportVocabulariesService,
    ImportCodesGuard,
    MappingCodesGuard
  ]
})
export class CodeMappingModule { }
