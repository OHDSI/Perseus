import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { IRow } from 'src/app/models/row';
import { ITable } from 'src/app/models/table';
import { CommonService } from 'src/app/services/common.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ValuesPopupComponent } from 'src/app/components/popaps/values-popup/values-popup.component';
import { CommentPopupComponent } from 'src/app/components/popaps/comment-popup/comment-popup.component';
import { BridgeService } from 'src/app/services/bridge.service';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelTableComponent implements OnInit {
  @Input() table: ITable;
  @Input() displayedColumns: string[];
  @ViewChild('htmlElement', { read: ElementRef }) element: HTMLElement;

  private rowConnections = {};

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

  constructor(
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private overlayService: OverlayService,
    private cdRef: ChangeDetectorRef
  ) {}

  get visibleRows() {
    return this.rows.filter((row: IRow) => row.visible);
  }

  ngOnInit(): void {
    this.bridgeService.deleteAll.subscribe(_ => {
      Object.keys(this.bridgeService.arrowsCache).forEach(key => {
        this.bridgeService.arrowsCache[key].source.htmlElement.classList.remove(
          'row-has-a-link-true'
        );
      });

      this.rowConnections = {};
    });

    this.bridgeService.connection.subscribe(connection => {
      if (this.table.area === 'source') {
        this.rows.forEach(row => {
          if (
            row.tableId === connection.source.tableId &&
            row.id === connection.source.id
          ) {
            this.rowConnections[row.key] = true;
          }
        });
      }
    });
  }

  isRowHasALink(row: IRow): boolean {
    if (typeof this.rowConnections[row.key] === 'undefined') {
      return false;
    } else {
      return this.rowConnections[row.key];
    }
  }

  setActiveRow(row: IRow) {
    this.commonService.activeRow = row;
  }

  openTopValuesDialog(anchor: HTMLElement) {
    const component = ValuesPopupComponent;
    this.overlayService.openDialog(anchor, component, 'values');
  }

  openCommentDialog(anchor: HTMLElement) {
    const component = CommentPopupComponent;
    const strategyFor = `comments-${this._getArea()}`;
    const overlayRef: OverlayRef = this.overlayService.openDialog(
      anchor,
      component,
      strategyFor
    );
    overlayRef.backdropClick().subscribe(() => this.cdRef.detectChanges());
  }

  hasComment(row: IRow) {
    return row.comments.length;
  }

  private _getArea() {
    return this.table.area;
  }
}
