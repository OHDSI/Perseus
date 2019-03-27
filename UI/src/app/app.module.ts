import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule, Actions } from '@ngrx/effects';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import {MatInputModule, MatFormFieldModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';

import { environment } from '../environments/environment';
import { MappingComponent } from './pages/mapping/mapping.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { VocabularyComponent } from './pages/vocabulary/vocabulary.component';
import { AreaComponent } from './pages/mapping/components/area/area.component';
import { PanelModule } from './pages/mapping/components/panel/panel.module';
import { commonReducer } from './pages/mapping/store/reducers/common.reducer';
import { dataReducer } from './pages/mapping/store/reducers/data.reducer';
import { DataEffect } from './pages/mapping/store/effects/data.effect';
import { DataService } from './pages/mapping/services/data.service';
import { DialogComponent } from './pages/mapping/components/dialog/dialog.component';
import { commentsReducer } from './pages/mapping/store/reducers/comments.reducer';
import { CommonService } from './pages/mapping/services/common.service';

@NgModule({
  declarations: [
    AppComponent,
    MappingComponent,
    OverviewComponent,
    VocabularyComponent,
    AreaComponent,
    DialogComponent
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

    StoreModule.forRoot({
      common: commonReducer,
      data: dataReducer,
      comments: commentsReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([DataEffect])
  ],
  providers: [DataService, CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
