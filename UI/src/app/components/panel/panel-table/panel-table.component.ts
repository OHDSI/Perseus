import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';

import { IRow } from 'src/app/models/row';
import { ITable } from 'src/app/models/table';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { CommentPopupComponent } from 'src/app/components/popaps/comment-popup/comment-popup.component';
import { BridgeService, IConnection } from 'src/app/services/bridge.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { Command } from '../../../infrastructure/command';
import { AddConstantPopupComponent } from '../../popaps/add-constant-popup/add-constant-popup.component';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss']
})
export class PanelTableComponent implements OnInit {
  @Input() table: ITable;
  @Input() displayedColumns: string[];
  @ViewChild('htmlElement', { read: ElementRef }) element: HTMLElement;

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

  get visibleRows() {
    return this.rows.filter((row: IRow) => row.visible);
  }

  constructor(
    private bridgeService: BridgeService,
    private overlayService: OverlayService
  ) {}

  private rowConnections = {};

  ngOnInit(): void {
    this.bridgeService.deleteAll.subscribe(_ => {
      Object.keys(this.bridgeService.arrowsCache).forEach(key => {
        this.bridgeService.arrowsCache[key].source.htmlElement.classList.remove(
          'row-has-a-link-true'
        );
      });

      this.rowConnections = {};
    });

    this.bridgeService.connection.subscribe(connection =>
      this.onConnection(connection)
    );
  }

  onConnection(connection: IConnection) {
    this.rows.forEach(row => {
      if (
        row.tableId === connection[this.table.area].tableId &&
        row.id === connection[this.table.area].id
      ) {
        this.rowConnections[row.key] = true;
      }
    });
  }

  isRowHasConnection(row: IRow): boolean {
    if (typeof this.rowConnections[row.key] === 'undefined') {
      return false;
    } else {
      return this.rowConnections[row.key];
    }
  }

  openCommentDialog(anchor: HTMLElement, row: IRow) {
    const component = CommentPopupComponent;

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      strategyFor: `comments-${this._getArea()}`,
      payload: row
    };

    const overlayRef = this.overlayService.open(
      dialogOptions,
      anchor,
      component
    );
  }

  openConstantDialog(anchor: HTMLElement, row: IRow) {
    if (!this.isRowHasConnection(row)) {
      const component = AddConstantPopupComponent;
      const value = { value: row.constant };

      const dialogOptions: OverlayConfigOptions = {
        hasBackdrop: true,
        backdropClass: 'custom-backdrop',
        strategyFor: `comments-${this._getArea()}`,
        payload: value
      };

      const overlayRef = this.overlayService.open(
        dialogOptions,
        anchor,
        component
      );

      overlayRef.close$.subscribe(ok => {
        row.constant = value.value;
      });
    }
  }

  hasComment(row: IRow) {
    return row.comments.length;
  }

  setActiveRow(row: IRow) {}

  private _getArea() {
    return this.table.area;
  }
}
