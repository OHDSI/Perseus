import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GridModule } from 'ng2-qgrid';
import { ThemeModule } from 'ng2-qgrid/theme/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { AreaComponent } from 'src/app/components/area/area.component';
import { MappingComponent } from 'src/app/components/pages/mapping/mapping.component';
import { PanelModule } from 'src/app/components/panel/panel.module';
import { CommentPopupComponent } from 'src/app/components/popups/comment-popup/comment-popup.component';
import { RulesPopupComponent } from 'src/app/components/popups/rules-popup/rules-popup.component';
import { ValuesPopupComponent } from 'src/app/components/popups/values-popup/values-popup.component';
import { BridgeService } from 'src/app/services/bridge.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { StateService } from 'src/app/services/state.service';
import { CdmCommonModule } from './common/cdm-common.module';
import { CdmCustomMaterialModule } from './common/cdm-custom-material.module';
import { BaseComponent } from './components/base/base.component';
import { BridgeButtonService } from './components/bridge-button/service/bridge-button.service';
import { ColumnsListComponent } from './components/columns-list/columns-list.component';
import { ComfySearchByNameComponent } from './components/comfy-search-by-name/comfy-search-by-name.component';
import { ComfyComponent } from './components/comfy/comfy.component';
import { HighlightConceptDirective } from './components/comfy/directives/highlight-concept.directive';
import { SavedMappingsComponent } from './components/comfy/saved-mappings/saved-mappings.component';
import { ConceptService } from './components/comfy/services/concept.service';
import { AddConstantPopupComponent } from './components/popups/add-constant-popup/add-constant-popup.component';
import { CdmVersionDialogComponent } from './components/popups/cdm-version-dialog/cdm-version-dialog.component';
import { OpenMappingDialogComponent } from './components/popups/open-mapping-dialog/open-mapping-dialog.component';
import { PreviewPopupComponent } from './components/popups/preview-popup/preview-popup.component';
import { PrismComponent } from './components/popups/preview-popup/prism.component';
import { SqlFunctionsInjector } from './components/popups/rules-popup/model/sql-functions-injector';
import { RulesPopupService } from './components/popups/rules-popup/services/rules-popup.service';
import { SQL_FUNCTIONS } from './components/popups/rules-popup/transformation-input/model/sql-string-functions';
import { TransformationInputComponent } from './components/popups/rules-popup/transformation-input/transformation-input.component';
import { SampleDataPopupComponent } from './components/popups/sample-data-popup/sample-data-popup.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { VocabularyDropdownComponent } from './components/vocabulary-search-select/vocabulary-dropdown.component';
import { ConceptConfigComponent } from './components/vocabulary-transform-configurator/concept-config/concept-config.component';
import { VocabularyBlockComponent } from './components/vocabulary-transform-configurator/concept-config/vocabulary-block/vocabulary-block.component';
import { ConditionDialogComponent } from './components/vocabulary-transform-configurator/condition-dialog/condition-dialog.component';
import { TransformConfigComponent } from './components/vocabulary-transform-configurator/transform-config.component';
import { VocabularyConditionComponent } from './components/vocabulary-transform-configurator/vocabulary-condition/vocabulary-condition.component';
import { VocabularyConfigComponent } from './components/vocabulary-transform-configurator/vocabulary-config/vocabulary-config.component';
import { HighlightDirective } from './directives/highlight-table.directive';
import { MappingPageSessionStorage } from './models/implementation/mapping-page-session-storage';
import { CommentService } from './services/comment.service';
import { CommonUtilsService } from './services/common-utils.service';
import { HttpService } from './services/http.service';
import { OverlayService } from './services/overlay/overlay.service';
import { UploadService } from './services/upload.service';
import { UserSettings } from './services/user-settings.service';
import { VocabulariesService } from './services/vocabularies.service';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
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
    CdmVersionDialogComponent,
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
    HttpService,
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
    CommonUtilsService,
    [{provide: SqlFunctionsInjector, useValue: SQL_FUNCTIONS}],
    MappingPageSessionStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
