import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit
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
export class PanelTableComponent implements OnInit, AfterViewInit {
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
    private overlayService: OverlayService,
    private renderer: Renderer2
  ) {}

  private rowConnections = {};

  ngOnInit(): void {
    this.bridgeService.deleteAll.subscribe(_ => {
      // Object.keys(this.bridgeService.arrowsCache).forEach(key => {
      //   this.bridgeService.arrowsCache[key].source.htmlElement.classList.remove(
      //     'row-has-a-link-true'
      //   );
      // });

      this.rowConnections = {};
    });

    this.bridgeService.connection.subscribe(connection => {
      this.AddConnection(connection);
      this.ShowConnectorPin(connection);
    });

    this.bridgeService.removeConnection.subscribe(connection => {
      this.HideConnectorPin(connection);
    });
  }

  ngAfterViewInit() {
    Object.values(this.bridgeService.arrowsCache).forEach(connection => {
      this.ShowConnectorPin(connection);
    });
  }

  AddConnection(connection: IConnection) {
    this.rows.forEach(row => {
      if (
        row.tableId === connection[this.table.area].tableId &&
        row.id === connection[this.table.area].id
      ) {
        this.rowConnections[row.key] = true;
      }
    });
  }

  ShowConnectorPin(connection: IConnection) {
    const rowId = connection.source.htmlElement.attributes.id.nodeValue;
    const element = document.getElementById(rowId);
    const collection = element.getElementsByClassName(
      'connector-pin'
    );
    if (collection.length > 0) {
      this.renderer.removeClass(collection[0], 'hide');
    }
  }

  HideConnectorPin(connection: IConnection) {
    const rowId = connection.source.htmlElement.attributes.id.nodeValue;
    const element = document.getElementById(rowId);
    const collection = element.getElementsByClassName(
      'connector-pin'
    );
    if (
      collection.length > 0 &&
      !this.bridgeService.isRowConnected(connection.source)
    ) {
      this.renderer.addClass(collection[0], 'hide');
    }
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
      positionStrategyFor: `comments-${this._getArea()}`,
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
        positionStrategyFor: `comments-${this._getArea()}`,
        payload: value
      };

      const overlayRef = this.overlayService.open(
        dialogOptions,
        anchor,
        component
      );

      overlayRef.close$.subscribe(ok => {
        row.constant = value.value;
        if (row.constant) {
          this.bridgeService.addConstant.execute(row);
        }
      });
    }
  }

  openTransform(event: any, row: IRow) {
    event.stopPropagation();

    // Find all corresponding rows
    const correspondingRows = this.bridgeService.findCorrespondingRows(this.table, row);


  }

  hasComment(row: IRow) {
    return row.comments.length;
  }

  setActiveRow(event: any, row: IRow) {
    event.stopPropagation();
  }

  selectRow(event: any, row: IRow) {
    event.stopPropagation();

    if (row.htmlElement) {
      const rowId = row.htmlElement.attributes.id.nodeValue;
      row.htmlElement = document.getElementById(rowId);

      row.selected = !row.selected;

      if (row.selected && row.htmlElement) {
        this.renderer.setAttribute(row.htmlElement, 'selected', 'true');
      } else {
        this.renderer.removeAttribute(row.htmlElement, 'selected');
      }

      Object.values(this.bridgeService.arrowsCache)
        .filter(connection => {
          return connection[row.area].id === row.id;
        })
        .forEach(connection => {
          if (row.selected) {
            connection.connector.select();
          } else {
            connection.connector.deselect();
          }
        });
    }
  }

  private _getArea() {
    return this.table.area;
  }
}
