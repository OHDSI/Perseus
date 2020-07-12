import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { CdmCommonModule } from 'src/app/common/cdm-common.module';
import { CdmCustomMaterialModule } from 'src/app/common/cdm-custom-material.module';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { PanelTableComponent } from 'src/app/components/panel/panel-table/panel-table.component';
import { PanelComponent } from 'src/app/components/panel/panel.component';
import { CommentPopupComponent } from 'src/app/components/popups/comment-popup/comment-popup.component';
import { DraggableDirective } from 'src/app/directives/draggable.directive';
import { DrawService } from 'src/app/services/draw.service';

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
  imports: [
    MatExpansionModule,
    CommonModule,
    CdmCustomMaterialModule,
    CdmCommonModule
  ],
  providers: [DrawService]

})
export class PanelModule {
}
