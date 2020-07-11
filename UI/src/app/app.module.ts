import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MappingComponent } from 'src/app/components/pages/mapping/mapping.component';
import { AreaComponent } from 'src/app/components/area/area.component';
import { PanelModule } from 'src/app/components/panel/panel.module';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { BridgeService } from 'src/app/services/bridge.service';
import { StateService } from 'src/app/services/state.service';
import { ValuesPopupComponent } from 'src/app/components/popups/values-popup/values-popup.component';
import { RulesPopupComponent } from 'src/app/components/popups/rules-popup/rules-popup.component';
import { CommentPopupComponent } from 'src/app/components/popups/comment-popup/comment-popup.component';
import { CommentService } from './services/comment.service';
import { CdmCustomMaterialModule } from './common/cdm-custom-material.module';
import { SampleDataPopupComponent } from './components/popups/sample-data-popup/sample-data-popup.component';
import { PreviewPopupComponent } from './components/popups/preview-popup/preview-popup.component';
import { CdmCommonModule } from './common/cdm-common.module';

import { GridModule } from 'ng2-qgrid';
import { ThemeModule } from 'ng2-qgrid/theme/material';
import { ComfyComponent } from './components/comfy/comfy.component';
import { ColumnsListComponent } from './components/columns-list/columns-list.component';
import { HighlightDirective } from './directives/highlight-table.directive';
import { OverlayService } from './services/overlay/overlay.service';
import { SavedMappingsComponent } from './components/comfy/saved-mappings/saved-mappings.component';
import { OpenMappingDialogComponent } from './components/popups/open-mapping-dialog/open-mapping-dialog.component';
import { UploadService } from './services/upload.service';
import { BridgeButtonService } from './components/bridge-button/service/bridge-button.service';
import { UserSettings } from './services/user-settings.service';
import { TransformationInputComponent } from './components/popups/rules-popup/transformation-input/transformation-input.component';
import { SqlFunctionsInjector } from './components/popups/rules-popup/model/sql-functions-injector';
import { SQL_FUNCTIONS } from './components/popups/rules-popup/transformation-input/model/sql-string-functions';
import { RulesPopupService } from './components/popups/rules-popup/services/rules-popup.service';
import { AddConstantPopupComponent } from './components/popups/add-constant-popup/add-constant-popup.component';
import { PrismComponent } from './components/popups/preview-popup/prism.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { VocabulariesService } from './services/vocabularies.service';
import { BaseComponent } from './components/base/base.component';
import { VocabularyDropdownComponent } from './components/vocabulary-search-select/vocabulary-dropdown.component';
import { VocabularyBlockComponent } from './components/vocabulary-transform-configurator/concept-config/vocabulary-block/vocabulary-block.component';
import { ConceptConfigComponent } from './components/vocabulary-transform-configurator/concept-config/concept-config.component';
import { VocabularyConditionComponent } from './components/vocabulary-transform-configurator/vocabulary-condition/vocabulary-condition.component';
import { HighlightConceptDirective } from './components/comfy/directives/highlight-concept.directive';
import { VocabularyConfigComponent } from './components/vocabulary-transform-configurator/vocabulary-config/vocabulary-config.component';
import { TransformConfigComponent } from './components/vocabulary-transform-configurator/transform-config.component';
import { ConditionDialogComponent } from './components/vocabulary-transform-configurator/condition-dialog/condition-dialog.component';
import { ConceptService } from './components/comfy/services/concept.service';
import { ComfySearchByNameComponent } from './components/comfy-search-by-name/comfy-search-by-name.component';
import { MappingPageSessionStorage } from './models/implementation/mapping-page-session-storage';

@NgModule({
  declarations: [
    AppComponent,
    MappingComponent,
    AreaComponent,
    CommentPopupComponent,
    ValuesPopupComponent,
    SampleDataPopupComponent,
    RulesPopupComponent,
    PreviewPopupComponent,
    ComfyComponent,
    ColumnsListComponent,
    HighlightDirective,
    SavedMappingsComponent,
    OpenMappingDialogComponent,
    TransformationInputComponent,
    AddConstantPopupComponent,
    PrismComponent,
    VocabularyDropdownComponent,
    VocabularyConfigComponent,
    VocabularyBlockComponent,
    BaseComponent,
    ConceptConfigComponent,
    VocabularyConditionComponent,
    HighlightConceptDirective,
    TransformConfigComponent,
    ConditionDialogComponent,
    ComfySearchByNameComponent
  ],
  entryComponents: [
    SampleDataPopupComponent,
    RulesPopupComponent,
    TransformConfigComponent,
    PreviewPopupComponent,
    ValuesPopupComponent,
    OpenMappingDialogComponent,
    AddConstantPopupComponent,
    ConditionDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PanelModule,
    CdmCustomMaterialModule,
    CdmCommonModule,
    GridModule,
    ThemeModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    OverlayService,
    DataService,
    CommonService,
    BridgeService,
    StateService,
    CommentService,
    OverlayService,
    UploadService,
    BridgeButtonService,
    UserSettings,
    RulesPopupService,
    VocabulariesService,
    ConceptService,
    [{ provide: SqlFunctionsInjector, useValue: SQL_FUNCTIONS}],
    MappingPageSessionStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
