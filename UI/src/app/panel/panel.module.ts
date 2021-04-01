import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CdmCommonModule } from 'src/app/common/cdm-common.module';
import { FilterComponent } from 'src/app/panel/filter/filter.component';
import { PanelTableComponent } from 'src/app/panel/panel-table/panel-table.component';
import { PanelComponent } from 'src/app/panel/panel.component';
import { DraggableDirective } from 'src/app/panel/directives/draggable.directive';
import { DrawService } from 'src/app/services/draw.service';
import { AreaComponent } from 'src/app/panel/area/area.component';
import { TargetCloneDialogComponent } from './target-clone-dialog/target-clone-dialog.component';

@NgModule({
  declarations: [
    AreaComponent,
    PanelComponent,
    PanelTableComponent,
    DraggableDirective,
    FilterComponent,
    TargetCloneDialogComponent
  ],
  exports: [
    PanelComponent,
    PanelTableComponent,
    FilterComponent,
    CdmCommonModule
  ],
  imports: [
    CommonModule,
    CdmCommonModule
  ],
  providers: [DrawService]

})
export class PanelModule {
}
