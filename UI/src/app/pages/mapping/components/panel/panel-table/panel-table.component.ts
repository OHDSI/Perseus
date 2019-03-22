import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommentsService } from 'src/app/pages/mapping/services/comments.service';
import { DragService } from 'src/app/pages/mapping/services/drag.service';

export interface Column {
  column_name: string;
  column_type: string;
}

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss']
})

export class PanelTableComponent {
  @Input() area: string;
  @Input() columns: Column[];
  @Input() tableName: string;
  @Input() displayedColumns: string[];
  activeRow = null;
  data$: Observable<any>;

  constructor( private commentsService: CommentsService, private dragService: DragService ) {};

  handleRowClick(row) {
    this.activeRow = row;
  }

  prepareForCommenting() {
    // create an object for storing comments if there is no one
    this.commentsService.prepareForCommenting(this.area, this.tableName, this.activeRow.column_name);
 }
}
