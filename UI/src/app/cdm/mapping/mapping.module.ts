import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';
import { MappingRoutingModule } from './mapping-routing.module';
import { CdmCommonModule } from '../../common/cdm-common.module';
import { VocabularySearchModule } from '../../vocabulary-search/vocabulary-search.module';
import { ScanDataModule } from '../../scan-data/scan-data.module';
import { PanelModule } from '../../panel/panel.module';
import { ConceptTransformationComponent } from './concept-transformation/concept-transformation.component';
import { ConceptColumnComponent } from './concept-transformation/concept-column/concept-column.component';
import { SqlTransformationComponent } from './sql-transformation/sql-transformation.component';
import { VocabularyDropdownComponent } from './vocabulary-dropdown/vocabulary-dropdown.component';
import { TransformConfigComponent } from './vocabulary-transform-configurator/transform-config.component';
import { ConceptConfigComponent } from './vocabulary-transform-configurator/concept-config/concept-config.component';
import { VocabularyBlockComponent } from './vocabulary-transform-configurator/concept-config/vocabulary-block/vocabulary-block.component';
import { ConditionDialogComponent } from './vocabulary-transform-configurator/condition-dialog/condition-dialog.component';
import { LookupComponent } from './vocabulary-transform-configurator/lookup/lookup.component';
import { VocabularyConditionComponent } from './vocabulary-transform-configurator/vocabulary-condition/vocabulary-condition.component';
import { VocabularyConfigComponent } from './vocabulary-transform-configurator/vocabulary-config/vocabulary-config.component';
import { SqlEditorModule } from '../../sql-editor/sql-editor.module';
import { PopupsModule } from '../../popups/popups.module';
import { PersonMappingWarningDialogComponent } from './person-mapping-warning-dialog/person-mapping-warning-dialog.component';

@NgModule({
  declarations: [
    MappingComponent,
    ConceptTransformationComponent,
    ConceptColumnComponent,
    SqlTransformationComponent,
    VocabularyDropdownComponent,
    TransformConfigComponent,
    ConceptConfigComponent,
    VocabularyBlockComponent,
    ConditionDialogComponent,
    LookupComponent,
    VocabularyConditionComponent,
    VocabularyConfigComponent,
    PersonMappingWarningDialogComponent,
  ],
  imports: [
    CommonModule,
    CdmCommonModule,
    MappingRoutingModule,
    VocabularySearchModule,
    ScanDataModule,
    PanelModule,
    SqlEditorModule,
    PopupsModule
  ],
  bootstrap: [
    MappingComponent
  ]
})
export class MappingModule { }
