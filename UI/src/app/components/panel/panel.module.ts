import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';

import { PanelComponent } from 'src/app/components/panel/panel.component';
import { PanelTableComponent } from 'src/app/components/panel/panel-table/panel-table.component';
import { DraggableDirective } from 'src/app/directives/draggable.directive';
import { DrawService } from 'src/app/services/draw.service';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { ValuesPopapComponent } from 'src/app/components/popaps/values-popap/values-popap.component';
import { CommentPopupComponent } from 'src/app/components/popaps/comment-popup/comment-popup.component';
import { CdmCustomMaterialModule } from 'src/app/common/cdm-custom-material.module';
import { CdmCommonModule } from 'src/app/common/cdm-common.module';

@NgModule({
  declarations: [
    PanelComponent,
    PanelTableComponent,
    DraggableDirective,
    FilterComponent,
  ],
  exports: [
    PanelComponent,
    PanelTableComponent,
    FilterComponent
  ],
  entryComponents: [
    CommentPopupComponent,
    ValuesPopapComponent
  ],
  imports: [
  MatExpansionModule,
    CommonModule,
    CdmCustomMaterialModule,
    CdmCommonModule
  ],
  providers: [DrawService]

})
export class PanelModule { }
