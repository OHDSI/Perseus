import { NgModule } from '@angular/core';
import { MappingComponent } from './mapping.component';
import { MappingRoutingModule } from './mapping-routing.module';
import { SharedModule } from '@shared/shared.module';
import { VocabularySearchModule } from '@vocabulary-search/vocabulary-search.module';
import { ScanDataModule } from '@scan-data/scan-data.module';
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
import { PopupsModule } from '@popups/popups.module';
import { PersonMappingWarningDialogComponent } from './person-mapping-warning-dialog/person-mapping-warning-dialog.component';
import { PanelComponent } from '@mapping/panel/panel.component';
import { AreaComponent } from '@mapping/panel/area/area.component';
import { DraggableDirective } from '@mapping/panel/directives/draggable.directive';
import { FilterComponent } from '@mapping/panel/filter/filter.component';
import { PanelTableComponent } from '@mapping/panel/panel-table/panel-table.component';
import { TargetCloneDialogComponent } from '@mapping/panel/target-clone-dialog/target-clone-dialog.component';

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
    PanelComponent,
    AreaComponent,
    DraggableDirective,
    FilterComponent,
    PanelTableComponent,
    TargetCloneDialogComponent
  ],
  imports: [
    SharedModule,
    MappingRoutingModule,
    VocabularySearchModule,
    ScanDataModule,
    PopupsModule
  ],
  bootstrap: [
    MappingComponent
  ]
})
export class MappingModule { }
