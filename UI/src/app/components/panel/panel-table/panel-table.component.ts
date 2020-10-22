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
  ViewChild,
  HostListener
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';

import { CommentPopupComponent } from 'src/app/components/popups/comment-popup/comment-popup.component';
import { Area } from 'src/app/models/area';
import { IRow } from 'src/app/models/row';
import { ITable } from 'src/app/models/table';
import { BridgeService, IConnection } from 'src/app/services/bridge.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { BaseComponent } from '../../../common/components/base/base.component';
import { AddConstantPopupComponent } from '../../popups/add-constant-popup/add-constant-popup.component';
import { StoreService } from 'src/app/services/store.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: [ './panel-table.component.scss' ]
})
export class PanelTableComponent extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() tables: ITable[];
  @Input() table: ITable;
  @Input() tabIndex: any;
  @Input() oppositeTableId: any;
  @Input() filtered: any;
  @Input() filteredFields: any;
  @Input() mappingConfig: any;

  @Output() openTransform = new EventEmitter<any>();

  @ViewChild('htmlElement', { read: ElementRef }) element: HTMLElement;
  @ViewChild('tableComponent', { static: true }) tableComponent: MatTable<IRow[]>;

  get displayedColumns() {
    return [ 'column_indicator', 'column_name', 'column_type', 'comments' ];
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

  datasource: MatTableDataSource<IRow>;
  rowFocusedElement;

  get connectionTypes(): any[] {
    return Object.keys(this.connectortype);
  }

  connectortype = {};

  constructor(
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private overlayService: OverlayService,
    private renderer: Renderer2,
    private chg: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    super();
  }

  @HostListener('document:click', [ '$event' ])
  onClick(event) {
    if (!event) {
      return;
    }
    const target = event.target;
    if (!target || !this.rowFocusedElement) {
      return;
    }
    const clickedOutside = !this.rowFocusedElement.contains(target);
    if (clickedOutside) {
      this.unsetRowFocus();
    }
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
    this.bridgeService.refreshAll();

    this.bridgeService.removeConnection
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connection => {
        if (connection) {
         this.hideConnectorPin(connection, Area.Target);
        }
      });

    this.storeService.state$.subscribe(res => {
      if (res) {
        this.filteredFields = res.filteredFields ? res.filteredFields[ this.table.name ] : res.filteredFields;
      }
    });
  }

  refreshPanel() {
    this.dataSourceInit(this.table.rows);
    this.bridgeService.refreshAll();
  }

  ngAfterViewInit() {
  }

  isRowHasConnection(row: IRow): boolean {
    return this.bridgeService.rowHasAnyConnection(row, this.area, this.oppositeTableId);
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
      const value = row.constant;
      const mode = value ? 'view' : 'add';
      const type = row.type;
      const data = { value, mode, type };
      const component = AddConstantPopupComponent;

      const dialogOptions: OverlayConfigOptions = {
        hasBackdrop: true,
        backdropClass: 'custom-backdrop',
        positionStrategyFor: `comments-${this._getArea()}`,
        payload: data
      };

      const overlayRef = this.overlayService.open(
        dialogOptions,
        anchor,
        component
      );

      overlayRef.afterClosed$.subscribe(ok => {
        row.constant = data.value;
        this.updateIncrementOrConstantFields(row, 'constant')
      });
    }
  }

  selectIncrement(anchor: HTMLElement, row: IRow) {
    if (!this.isRowHasConnection(row)) {
      this.updateIncrementOrConstantFields(row, 'increment');
    }
  }

  updateIncrementOrConstantFields(row: IRow, type: string) {
    let similarRows = [];
    if (row.tableName.toUpperCase() === 'SIMILAR') {
      similarRows = this.bridgeService.findSimilarRows(this.tables, row.name);
    } else {
      similarRows.push(row);
    }
    const isSameRow = (item: IRow) => {
      let found = false;
      similarRows.forEach(similarItem => {
        if (item.tableName.toUpperCase() === similarItem.tableName.toUpperCase() &&
          item.name.toUpperCase() === similarItem.name.toUpperCase()) {
          found = true;
        }
      });
      return found;
    };
    if (type === 'increment') {
      const value = !row.increment;
      this.bridgeService.updateRowsProperties(this.tables, isSameRow, (item: any) => { item.increment = value; });
      this.bridgeService.updateRowsProperties(this.storeService.state.target, isSameRow, (item: any) => { item.increment = value; });
    } else {
      const value = row.constant;
      this.bridgeService.updateRowsProperties(this.tables, isSameRow, (item: any) => {
        item.constant = value;
        if (row.constant) {
            this.bridgeService.addConstant.execute(item);
        } else {
            this.bridgeService.dropConstant.execute(item);
        }

      });
      this.bridgeService.updateRowsProperties(this.storeService.state.target, isSameRow, (item: any) => {
        item.constant = value;
      });
    }
  }

  onTransformDialogOpen(event: any, row: IRow, element: any) {
    event.stopPropagation();
    this.openTransform.emit({ row, element });
  }

  hasComment(row: IRow) {
    return row.comments.length;
  }

  rowClick($event: MouseEvent) {
    $event.stopPropagation();
    this.setRowFocus($event.currentTarget);
  }

  setRowFocus(target) {
    if (target) {
      this.unsetRowFocus();
      this.rowFocusedElement = target;
      this.rowFocusedElement.classList.add('row-focus');
    }
  }

  unsetRowFocus() {
    const focused: HTMLAllCollection = this.elementRef.nativeElement.querySelectorAll('.row-focus');
    Array.from(focused).forEach((it: HTMLElement) => it.classList.remove('row-focus'));
    this.rowFocusedElement = undefined;
  }

  // connectortype is not reflected in the table
  reflectConnectorsPin(table: ITable) {
    this.connectortype = {};
    Object.values(this.bridgeService.arrowsCache)
      .filter(connection => {
        return this.equals(connection[ table.area ].tableName, table.name);
      })
      .forEach(connection => {
        this.showConnectorPinElement(connection, table.area);
      });
  }

  showConnectorPinElement(connection: IConnection, area: Area) {
    const rowId = connection[ area ].name;
    const element = document.getElementById(rowId);
    if (element) {
      const collection = element.getElementsByClassName('connector-pin');
      for (let i = 0; i < collection.length; i++) {
        this.renderer.removeClass(collection[ i ], 'hide');
      }
    }
  }

  hideAllConnectorPin(element) {
    const collection = element.getElementsByClassName('connector-pin');
    for (let i = 0; i < collection.length; i++) {
      this.renderer.addClass(collection[ i ], 'hide');
    }
  }

  hideConnectorPin(connection: IConnection, area: Area) {
    const rowId = connection[ area ].name;
    const element = document.getElementById(rowId);
    if (element) {
      const collection = element.getElementsByClassName('connector-pin');
      for (let i = 0; i < collection.length; i++) {
        this.renderer.addClass(collection[ 0 ], 'hide');
      }
    }
  }

  isHidden(row) {
    if (this.filtered === undefined) {
      return false;
    }
    return !this.filtered.includes(row.name);
  }

  isFiltered(row) {
    if (this.filteredFields === undefined) {
      return false;
    }
    return (this.filteredFields &&
      this.filteredFields.items &&
      this.filteredFields.items.length &&
      (!this.filteredFields.items.includes(row.name.toUpperCase()) &&
        !this.filteredFields.items.includes(row.name)));
  }

  private _getArea() {
    return this.table.area;
  }
}
