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
import { BridgeButtonComponent } from 'src/app/components/bridge-button/bridge-button.component';
import { BridgeService } from 'src/app/services/bridge.service';
import { StateService } from 'src/app/services/state.service';
import { ValuesPopupComponent } from 'src/app/components/popaps/values-popup/values-popup.component';
import { RulesPopupComponent } from 'src/app/components/popaps/rules-popup/rules-popup.component';
import { CommentPopupComponent } from 'src/app/components/popaps/comment-popup/comment-popup.component';
import { CommentService } from './services/comment.service';
import { CdmCustomMaterialModule } from './common/cdm-custom-material.module';
import { SampleDataPopupComponent } from './components/popaps/sample-data-popup/sample-data-popup.component';
import { PreviewPopupComponent } from './components/popaps/preview-popup/preview-popup.component';
import { CdmCommonModule } from './common/cdm-common.module';

import { GridModule } from 'ng2-qgrid';
import { ThemeModule } from 'ng2-qgrid/theme/material';
import { ComfyComponent } from './components/comfy/comfy.component';
import { MappingPopupComponent } from './components/popaps/mapping-popup/mapping-popup.component';
import { ColumnsListComponent } from './components/columns-list/columns-list.component';
import { HighlightDirective } from './directives/highlight-table.directive';
import { OverlayService } from './services/overlay/overlay.service';
import { SavedMappingsComponent } from './components/comfy/saved-mappings/saved-mappings.component';
import { OpenMappingDialogComponent } from './components/popaps/open-mapping-dialog/open-mapping-dialog.component';
import { UploadService } from './services/upload.service';
import { BridgeButtonService } from './services/bridge-button.service';
import { UserSettings } from './services/user-settings.service';
import { TransformationInputComponent } from './components/popaps/rules-popup/transformation-input/transformation-input.component';
import { SqlFunctionsInjector } from './components/popaps/rules-popup/model/sql-functions-injector';
import { SQL_FUNCTIONS } from './components/popaps/rules-popup/transformation-input/model/sql-string-functions';
import { RulesPopupService } from './components/popaps/rules-popup/services/rules-popup.service';
import { AddConstantPopupComponent } from './components/popaps/add-constant-popup/add-constant-popup.component';
import { PrismComponent } from './components/popaps/preview-popup/prism.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { VocabulariesService } from './services/vocabularies.service';
import { BaseComponent } from './components/base/base.component';
import { VocabularyDropdownComponent } from './components/vocabulary-search-select/vocabulary-dropdown.component';
import { VocabularyConfigComponent } from './components/vocabulary-transform-configurator/vocabulary-config.component';
import { VocabularyBlockComponent } from './components/vocabulary-transform-configurator/vocabulary-block/vocabulary-block.component';
import { VocabularyConditionComponent } from './components/vocabulary-transform-configurator/vocabulary-condition/vocabulary-condition.component';

@NgModule({
  declarations: [
    AppComponent,
    MappingComponent,
    AreaComponent,
    CommentPopupComponent,
    BridgeButtonComponent,
    ValuesPopupComponent,
    SampleDataPopupComponent,
    RulesPopupComponent,
    PreviewPopupComponent,
    ComfyComponent,
    MappingPopupComponent,
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
    VocabularyConditionComponent
  ],
  entryComponents: [
    BridgeButtonComponent,
    SampleDataPopupComponent,
    RulesPopupComponent,
    PreviewPopupComponent,
    MappingPopupComponent,
    ValuesPopupComponent,
    OpenMappingDialogComponent,
    AddConstantPopupComponent
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
    [{ provide: SqlFunctionsInjector, useValue: SQL_FUNCTIONS}]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
