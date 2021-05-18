import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FilterComponent } from 'src/app/panel/filter/filter.component';
import { PanelTableComponent } from 'src/app/panel/panel-table/panel-table.component';
import { PanelComponent } from 'src/app/panel/panel.component';
import { DraggableDirective } from 'src/app/panel/directives/draggable.directive';
import { DrawService } from 'src/app/services/draw.service';
import { AreaComponent } from 'src/app/panel/area/area.component';
import { TargetCloneDialogComponent } from './target-clone-dialog/target-clone-dialog.component';
import { BridgeButtonService } from '../services/bridge-button/bridge-button.service';

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
  ],
  imports: [
    SharedModule
  ],
  providers: [
    DrawService,
    BridgeButtonService
  ]
})
export class PanelModule {
}
