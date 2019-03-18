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

import { MappingComponent } from './components/pages/mapping/mapping.component';
import { OverviewComponent } from './components/pages/overview/overview.component';
import { VocabularyComponent } from './components/pages/vocabulary/vocabulary.component';
import { TableComponent } from './components/table/table.component';
import { commonReducer } from './store/reducers/common.reducer';
import { environment } from '../environments/environment';
import { PanelComponent } from './components/panel/panel.component';
import { dataReducer } from './store/reducers/data.reducer';
import { DataService } from 'src/app/services/data.service';
import { DataEffect } from 'src/app/store/effects/data.effect';
import { PanelTableComponent } from 'src/app/components/panel/panel-table/panel-table.component';
import { PanelModule } from 'src/app/components/panel/panel.module';
import { TypeToIconPipe } from 'src/app/pipes/type-to-icon.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MappingComponent,
    OverviewComponent,
    VocabularyComponent,
    TableComponent,
    PanelComponent,
    PanelTableComponent,
    TypeToIconPipe
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
    MatExpansionModule,
    MatTableModule,

    StoreModule.forRoot({
      common: commonReducer,
      data: dataReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([DataEffect])
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
