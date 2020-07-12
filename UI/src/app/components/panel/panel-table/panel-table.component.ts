import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

import { CommentPopupComponent } from 'src/app/components/popups/comment-popup/comment-popup.component';
import { Area } from 'src/app/models/area';
import { IRow } from 'src/app/models/row';
import { ITable } from 'src/app/models/table';
import { BridgeService, IConnection } from 'src/app/services/bridge.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { BaseComponent } from '../../base/base.component';
import { AddConstantPopupComponent } from '../../popups/add-constant-popup/add-constant-popup.component';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss']
})
export class PanelTableComponent extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() table: ITable;
  @Input() tabIndex: any;
  @Input() displayedColumns: string[];

  @Output() openTransform = new EventEmitter<any>();

  @ViewChild('htmlElement', { read: ElementRef, static: false }) element: HTMLElement;
  @ViewChild('tableComponent', { static: true }) tableComponent: MatTable<IRow[]>;

  get area() {
    return this.table.area;
  }

  get totalRowsNumber() {
    return this.table.rows.length;
  }

  get visibleRowsNumber() {
    return this.table.rows.filter((row: IRow) => row.visible).length;
  }

  datasource: MatTableDataSource<IRow>;

  get connectionTypes(): any[] {
    return Object.keys(this.connectortype);
  }

  connectortype = {};

  private rowConnections = {};

  constructor(
    private bridgeService: BridgeService,
    private overlayService: OverlayService,
    private renderer: Renderer2,
    private chg: ChangeDetectorRef
  ) {
    super();
  }

  ngOnChanges() {
  }

  equals(name1: string, name2: string): boolean {
    return name1.toUpperCase() === name2.toUpperCase();
  }

  dataSourceInit(data: any[]) {
    this.datasource = new MatTableDataSource(
      data.filter((row: IRow) => row.visible)
    );
  }

  ngOnInit(): void {
    this.dataSourceInit(this.table.rows);

    this.bridgeService.deleteAll
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        this.rowConnections = {};
      });

    this.bridgeService.connection
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connection => {
        this.addConnection(connection);

        setTimeout(() => {
          this.showConnectorPinElement(connection, Area.Target);
        });
      });

    this.bridgeService.removeConnection
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connection => {
        this.hideConnectorPin(connection, Area.Target);
      });
  }

  ngAfterViewInit() {
  }

  addConnection(connection: IConnection) {
    this.table.rows.forEach(row => {
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
      const value = {value: row.constant};

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

  onTransformDialogOpen(event: any, row: IRow, element: any) {
    event.stopPropagation();
    this.openTransform.emit({row, element});
  }

  hasComment(row: IRow) {
    return row.comments.length;
  }

  setActiveRow(event: any, row: IRow) {
    event.stopPropagation();
  }

  selectTableRow(event: any, row: IRow) {
    event.stopPropagation();

    if (row.htmlElement) {
      const rowId = row.htmlElement.attributes.id.nodeValue;
      row.htmlElement = document.getElementById(rowId);

      row.selected = !row.selected;

      if (this.renderer && row.selected && row.htmlElement) {
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

  // connectortype is not reflected in the table
  reflectConnectorsPin(target: ITable) {
    this.connectortype = {};
    Object.values(this.bridgeService.arrowsCache)
      .filter(connection => {
        return this.equals(connection.target.tableName, target.name);
      })
      .forEach(connection => {
        this.showConnectorPinElement(connection, Area.Target);
      });
  }

  showConnectorPinElement(connection: IConnection, area: Area) {
    const rowId = connection[area].htmlElement.attributes.id.nodeValue;
    const element = document.getElementById(rowId);
    const collection = element.getElementsByClassName('connector-pin');
    for (let i = 0; i < collection.length; i++) {
      this.renderer.removeClass(collection[i], 'hide');
    }
  }

  hideAllConnectorPin(element) {
    const collection = element.getElementsByClassName('connector-pin');
    for (let i = 0; i < collection.length; i++) {
      this.renderer.addClass(collection[i], 'hide');
    }
  }

  hideConnectorPin(connection: IConnection, area: Area) {
    const rowId = connection[area].htmlElement.attributes.id.nodeValue;
    const element = document.getElementById(rowId);
    const collection = element.getElementsByClassName('connector-pin');
    for (let i = 0; i < collection.length; i++) {
      this.renderer.addClass(collection[0], 'hide');
    }
  }

  private _getArea() {
    return this.table.area;
  }
}
