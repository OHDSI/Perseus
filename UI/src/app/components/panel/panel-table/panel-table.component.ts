import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { IRow } from 'src/app/models/row';
import { ITable } from 'src/app/models/table';
import { CommonService } from 'src/app/services/common.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ValuesPopapComponent } from 'src/app/components/popaps/values-popap/values-popap.component';
import { CommentPopupComponent } from 'src/app/components/popaps/comment-popup/comment-popup.component';
import { MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OverlayService]
})

export class PanelTableComponent {
  @Input() table: ITable;
  @Input() displayedColumns: string[];
  @ViewChild('htmlElement', {read: ElementRef}) element: HTMLElement;

  constructor(
    private commonService: CommonService,
    private overlayService: OverlayService,
    private cdRef: ChangeDetectorRef
  ) {};

  get visibleRows() {
    return this.rows.filter((row: IRow) => row.visible);
  }

  get rows() {
    return this.table.rows;
  }

  get area() {
    return this.table.area;
  }

  get totalRowsNumber() {
    return this.table.rows.length;
  }
  get visibleRowsNumber() {
    return this.table.rows.filter((row: IRow) => row.visible).length;
  }

  setActiveRow(row: IRow) {
    this.commonService.activeRow = row;
  }

  openTopValuesDialog(anchor: HTMLElement) {
    const component = ValuesPopapComponent;
    this.overlayService.openDialog(anchor, component, 'values');
  }

  openCommentDialog(anchor: HTMLElement) {
    const component = CommentPopupComponent;
    const strategyFor = `comments-${this._getArea()}`;
    const overlayRef: OverlayRef = this.overlayService.openDialog(anchor, component, strategyFor);
    overlayRef.backdropClick().subscribe(() => this.cdRef.detectChanges());
  }

  hasComment(row: IRow) {
    return row.comments.length;
  }

  private _getArea() {
    return this.table.area;
  }
}
