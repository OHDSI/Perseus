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
import { OverlayService } from './services/overlay.service';
import { SavedMappingsComponent } from './components/comfy/saved-mappings/saved-mappings.component';
import { OpenMappingDialogComponent } from './components/popaps/open-mapping-dialog/open-mapping-dialog.component';
import { UploadService } from './services/upload.service';
import { DrawTransformatorService } from './services/draw-transformator.service';
import { UserSettings } from './services/user-settings.service';

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
    OpenMappingDialogComponent
  ],
  entryComponents: [
    BridgeButtonComponent,
    SampleDataPopupComponent,
    RulesPopupComponent,
    PreviewPopupComponent,
    MappingPopupComponent,
    ValuesPopupComponent,
    OpenMappingDialogComponent
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
    ThemeModule
  ],
  providers: [
    DataService,
    CommonService,
    BridgeService,
    StateService,
    CommentService,
    OverlayService,
    UploadService,
    DrawTransformatorService,
    UserSettings
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
