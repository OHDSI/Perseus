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
import { TypeToIconPipe } from '../../pipes/type-to-icon.pipe';
import { CommentPopupDirective } from '../../directives/commentPopup.directive';
import { DraggableDirective } from '../../directives/draggable.directive';
import { CommentsService } from '../../services/comments.service';
import { DragService } from '../../services/drag.service';
import { DrawService } from '../../services/draw.service';

@NgModule({
  declarations: [
    PanelComponent,
    PanelTableComponent,
    PanelTableColumnComponent,
    TypeToIconPipe,
    CommentPopupDirective,
    DraggableDirective
  ],
  exports: [
    PanelComponent,
    PanelTableComponent,
    PanelTableColumnComponent
  ],
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule
  ],
  providers: [CommentsService, DragService, DrawService]

})
export class PanelModule { }
