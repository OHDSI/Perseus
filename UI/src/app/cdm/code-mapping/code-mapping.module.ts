import { NgModule } from '@angular/core';
import { ImportCodesComponent } from './import-codes/import-codes.component';
import { MappingCodesComponent } from './mapping-codes/mapping-codes.component';
import { CodeMappingRoutingModule } from './code-mapping-routing.module';
import { ImportVocabularyComponent } from './import-codes/import-vocabulary/import-vocabulary.component';
import { ImportVocabularyButtonsComponent } from './import-codes/import-vocabulary/import-vocabulary-buttons/import-vocabulary-buttons.component';
import { GridModule } from '@grid/grid.module';
import { ImportVocabulariesService } from '@services/import-codes/import-vocabularies.service';
import { ColumnMappingFormComponent } from './import-codes/column-mapping/column-mapping-form/column-mapping-form.component';
import { ColumnMappingFiltersComponent } from './import-codes/column-mapping/column-mapping-filters/column-mapping-filters.component';
import { SharedModule } from '@shared/shared.module';
import { ColumnMappingComponent } from './import-codes/column-mapping/column-mapping.component';
import { MatchScoreGridComponent } from './mapping-codes/match-score-grid/match-score-grid.component';
import { MappingCodesGuard } from '@guards/code-mapping/mapping-codes.guard';
import { SaveVocabularyPopupComponent } from './mapping-codes/save-vocabulary-popup/save-vocabulary-popup.component';
import { EditMappingPanelComponent } from './mapping-codes/edit-mapping-panel/edit-mapping-panel.component';
import { EditCodeMappingGridComponent } from './mapping-codes/edit-mapping-panel/edit-code-mapping-grid/edit-code-mapping-grid.component';
import { ScoredConceptsCacheService } from '@services/import-codes/scored-concepts-cache.service';
import { ImportCodesMediatorService } from '@services/import-codes/import-codes-mediator.service';
import { ImportCodesGridComponent } from './import-codes/column-mapping/import-codes-grid/import-codes-grid.component';
import { ImportCodesGuard } from '@guards/code-mapping/import-codes.guard';
import { VocabularySearchModule } from '@vocabulary-search/vocabulary-search.module';

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
    SaveVocabularyPopupComponent,
    EditMappingPanelComponent,
    EditCodeMappingGridComponent,
    ImportCodesGridComponent
  ],
  imports: [
    CodeMappingRoutingModule,
    SharedModule,
    GridModule,
    VocabularySearchModule
  ],
  providers: [
    ImportVocabulariesService,
    MappingCodesGuard,
    ScoredConceptsCacheService,
    ImportCodesMediatorService,
    ImportCodesGuard,
  ]
})
export class CodeMappingModule { }
