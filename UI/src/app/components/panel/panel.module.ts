import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { PanelComponent } from 'src/app/components/panel/panel.component';
import { PanelTableComponent } from 'src/app/components/panel/panel-table/panel-table.component';
import { TypeToIconPipe } from 'src/app/pipes/type-to-icon.pipe';
import { DraggableDirective } from 'src/app/directives/draggable.directive';
import { CommentsService } from 'src/app/services/comments.service';
import { DragService } from 'src/app/services/drag.service';
import { DrawService } from 'src/app/services/draw.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FilterComponent } from 'src/app/components/filter/filter.component';

@NgModule({
  declarations: [
    PanelComponent,
    PanelTableComponent,
    TypeToIconPipe,
    DraggableDirective
  ],
  exports: [
    PanelComponent,
    PanelTableComponent,
  ],
  entryComponents: [
    DialogComponent,
    FilterComponent
  ],
  imports: [
    MatExpansionModule,
    MatTableModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [CommentsService, DragService, DrawService]

})
export class PanelModule { }
