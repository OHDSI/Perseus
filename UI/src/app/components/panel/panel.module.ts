import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { PanelComponent } from 'src/app/components/panel/panel.component';
import { PanelTableComponent } from 'src/app/components/panel/panel-table/panel-table.component';
import { DraggableDirective } from 'src/app/directives/draggable.directive';
import { DrawService } from 'src/app/services/draw.service';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { ValuesPopupComponent } from 'src/app/components/popaps/values-popup/values-popup.component';
import { CommentPopupComponent } from 'src/app/components/popaps/comment-popup/comment-popup.component';
import { CdmCustomMaterialModule } from 'src/app/common/cdm-custom-material.module';
import { CdmCommonModule } from 'src/app/common/cdm-common.module';

@NgModule({
  declarations: [
    PanelComponent,
    PanelTableComponent,
    DraggableDirective,
    FilterComponent
  ],
  exports: [
    PanelComponent,
    PanelTableComponent,
    FilterComponent
  ],
  entryComponents: [
    CommentPopupComponent,
    ValuesPopupComponent
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
