import { NgModule } from '@angular/core';
import { MappingComponent } from './mapping.component';
import { MappingRoutingModule } from './mapping-routing.module';
import { SharedModule } from '@shared/shared.module';
import { VocabularySearchModule } from '@vocabulary-search/vocabulary-search.module';
import { ScanDataModule } from '@scan-data/scan-data.module';
import { ConceptTransformationComponent } from './concept-transformation/concept-transformation.component';
import { ConceptColumnComponent } from './concept-transformation/concept-column/concept-column.component';
import { ManualTransformationComponent } from './sql-transformation/manual-transformation/manual-transformation.component';
import { TransformConfigComponent } from './transform-config/transform-config.component';
import { LookupComponent } from './lookup/lookup.component';
import { PopupsModule } from '@popups/popups.module';
import { PanelComponent } from '@mapping/panel/panel.component';
import { AreaComponent } from '@mapping/panel/area/area.component';
import { DraggableDirective } from '@mapping/panel/directives/draggable.directive';
import { PanelTableComponent } from '@mapping/panel/panel-table/panel-table.component';
import { TargetCloneDialogComponent } from '@mapping/panel/target-clone-dialog/target-clone-dialog.component';
import { SqlTransformationComponent } from './sql-transformation/sql-transformation.component';
import { ReplaceTransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function.component';
import { VisualTransformationComponent } from './sql-transformation/visual-transformation/visual-transformation.component';
import { DatePartTransformationFunctionComponent } from './sql-transformation/visual-transformation/function/date-part-transformation-function/date-part-transformation-function.component';
import { NoArgsTransformationFunctionComponent } from './sql-transformation/visual-transformation/function/no-args-transformation-function/no-args-transformation-function.component';
import { DateAddTransformationFunctionComponent } from './sql-transformation/visual-transformation/function/date-add-transformation-function/date-add-transformation-function.component';
import { SwitchCaseTransformationFunctionComponent } from './sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function.component';

@NgModule({
  declarations: [
    MappingComponent,
    ConceptTransformationComponent,
    ConceptColumnComponent,
    ManualTransformationComponent,
    TransformConfigComponent,
    LookupComponent,
    PanelComponent,
    AreaComponent,
    DraggableDirective,
    PanelTableComponent,
    TargetCloneDialogComponent,
    SqlTransformationComponent,
    ReplaceTransformationFunctionComponent,
    VisualTransformationComponent,
    DatePartTransformationFunctionComponent,
    NoArgsTransformationFunctionComponent,
    DateAddTransformationFunctionComponent,
    SwitchCaseTransformationFunctionComponent
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
