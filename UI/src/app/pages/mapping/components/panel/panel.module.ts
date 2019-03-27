import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelComponent } from './panel.component';
import { PanelTableComponent } from './panel-table/panel-table.component';
import { PanelTableColumnComponent } from './panel-table-column/panel-table-column.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TypeToIconPipe } from '../../pipes/type-to-icon.pipe';
import { DraggableDirective } from '../../directives/draggable.directive';
import { CommentsService } from '../../services/comments.service';
import { DragService } from '../../services/drag.service';
import { DrawService } from '../../services/draw.service';
import { DialogComponent } from '../dialog/dialog.component';

@NgModule({
  declarations: [
    PanelComponent,
    PanelTableComponent,
    PanelTableColumnComponent,
    TypeToIconPipe,
    DraggableDirective
  ],
  exports: [
    PanelComponent,
    PanelTableComponent,
    PanelTableColumnComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  imports: [
    MatExpansionModule,
    MatTableModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [CommentsService, DragService, DrawService]

})
export class PanelModule { }
