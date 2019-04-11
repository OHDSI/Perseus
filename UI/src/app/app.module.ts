import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MappingComponent } from 'src/app/components/pages/mapping/mapping.component';
import { OverviewComponent } from 'src/app/components/pages/overview/overview.component';
import { VocabularyComponent } from 'src/app/components/pages/vocabulary/vocabulary.component';
import { AreaComponent } from 'src/app/components/area/area.component';
import { PanelModule } from 'src/app/components/panel/panel.module';
import { DataService } from 'src/app/services/data.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { BridgeButtonComponent } from 'src/app/components/bridge-button/bridge-button.component';
import { BridgeService } from 'src/app/services/bridge.service';
import { StateService } from 'src/app/services/state.service';
import { ValuesPopapComponent } from 'src/app/components/popaps/values-popap/values-popap.component';
import { SampleDataPopupComponent } from 'src/app/components/popaps/sample-data-popup/sample-data-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    MappingComponent,
    OverviewComponent,
    VocabularyComponent,
    AreaComponent,
    DialogComponent,
    BridgeButtonComponent,
    ValuesPopapComponent,
    SampleDataPopupComponent
  ],
  entryComponents: [
    BridgeButtonComponent,
    SampleDataPopupComponent
  ],
  imports: [
  BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatTableModule,
    PanelModule,
    OverlayModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatMenuModule
  ],
  providers: [DataService, CommonService, BridgeService, StateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
