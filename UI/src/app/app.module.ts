import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MappingComponent } from 'src/app/components/pages/mapping/mapping.component';
import { OverviewComponent } from 'src/app/components/pages/overview/overview.component';
import { VocabularyComponent } from 'src/app/components/pages/vocabulary/vocabulary.component';
import { AreaComponent } from 'src/app/components/area/area.component';
import { PanelModule } from 'src/app/components/panel/panel.module';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { BridgeButtonComponent } from 'src/app/components/bridge-button/bridge-button.component';
import { BridgeService } from 'src/app/services/bridge.service';
import { StateService } from 'src/app/services/state.service';
import { ValuesPopapComponent } from 'src/app/components/popaps/values-popap/values-popap.component';
import { RulesPopupComponent } from 'src/app/components/popaps/rules-popup/rules-popup.component';
import { CommentPopupComponent } from 'src/app/components/popaps/comment-popup/comment-popup.component';
import { CommentService } from './services/comment.service';
import { CdmCustomMaterialModule } from './common/cdm-custom-material.module';
import { SampleDataPopupComponent } from './components/popaps/sample-data-popup/sample-data-popup.component';
import { PreviewPopupComponent } from './components/popaps/preview-popup/preview-popup.component';
import { CdmCommonModule } from './common/cdm-common.module';

@NgModule({
  declarations: [
    AppComponent,
    MappingComponent,
    OverviewComponent,
    VocabularyComponent,
    AreaComponent,
    CommentPopupComponent,
    BridgeButtonComponent,
    ValuesPopapComponent,
    SampleDataPopupComponent,
    RulesPopupComponent,
    PreviewPopupComponent
  ],
  entryComponents: [
    BridgeButtonComponent,
    SampleDataPopupComponent,
    RulesPopupComponent,
    PreviewPopupComponent
  ],
  imports: [
  BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PanelModule,
    CdmCustomMaterialModule,
    CdmCommonModule
  ],
  providers: [DataService, CommonService, BridgeService, StateService, CommentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
