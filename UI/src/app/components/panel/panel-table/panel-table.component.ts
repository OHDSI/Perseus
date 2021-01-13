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
import { Row, IRow, RowOptions } from 'src/app/models/row';
import { ITable } from 'src/app/models/table';
import { BridgeService, IConnection } from 'src/app/services/bridge.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { BaseComponent } from '../../../common/components/base/base.component';
import { AddConstantPopupComponent } from '../../popups/add-constant-popup/add-constant-popup.component';
import { StoreService } from 'src/app/services/store.service';
import { DataService } from 'src/app/services/data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { OpenSaveDialogComponent } from '../../popups/open-save-dialog/open-save-dialog.component';
import { cloneDeep, uniq } from 'src/app/infrastructure/utility';
import { ErrorPopupComponent } from '../../popups/error-popup/error-popup.component';
import * as fieldTypes from './similar-types.json';
import { DeleteWarningComponent } from '../../popups/delete-warning/delete-warning.component';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: [ './panel-table.component.scss' ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden', display: 'none' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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
  @Input() createGroupElementId: string;

  @Output() openTransform = new EventEmitter<any>();

  @ViewChild('htmlElement', { read: ElementRef }) element: HTMLElement;
  @ViewChild('tableComponent', { static: true }) tableComponent: MatTable<IRow[]>;

  get displayedColumns() {
    return [ 'column_indicator', 'column_name', 'column_type', 'comments', 'remove_group' ];
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
  rowFocusedElements: any[] = [];
  focusedRowsNames: string[] = [];
  fieldTypes = (fieldTypes as any).default as Map<string, string[]>;

  get connectionTypes(): any[] {
    return Object.keys(this.connectortype);
  }

  connectortype = {};
  expandedElement: any = undefined;
  groupDialogOpened = false;
  cloneName = 'test';

  constructor(
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private overlayService: OverlayService,
    private renderer: Renderer2,
    private chg: ChangeDetectorRef,
    private elementRef: ElementRef,
    private matDialog: MatDialog
  ) {
    super();
  }

  @HostListener('document:click', [ '$event' ])
  onClick(event) {
    if (!event) {
      return;
    }
    const target = event.target;
    if (!target || !this.rowFocusedElements || !this.rowFocusedElements.length) {
      return;
    }
    const clickedOutside = target.id !== this.createGroupElementId && !this.groupDialogOpened;
    if (clickedOutside) {
      this.unsetRowFocus();
    }
  }

  ngOnChanges() {
  }

  equals(name1: string, name2: string): boolean {
    return name1.toUpperCase() === name2.toUpperCase();
  }

  expandRow(row: Row) {
    this.expandedElement = this.expandedElement === row ? undefined : row;
    this.bridgeService.adjustArrowsPositions();
    this.refreshPanel();
  }

  isExpansionDetailRow = (i: number, row: IRow) => {
    return row.grouppedFields && row.grouppedFields.length;
  }

  checkExpanded(row: IRow) {
    const res = row === this.expandedElement ? 'expanded' : 'collapsed';
    return res;
  }

  dataSourceInit(data: any[]) {
    this.datasource = new MatTableDataSource(
      data.filter((row: IRow) => row.visible)
    );
  }

  getDataSourceForExpandedPanel(detail: any) {
    return new MatTableDataSource(this.datasource.data.filter(item => item.name === detail.name)[ 0 ].grouppedFields);
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

  refreshPanel(event?: any) {
    this.dataSourceInit(this.table.rows);
    if (!event) {
      this.bridgeService.refreshAll();
    }
  }

  reorderRows(row: IRow) {
    const replacerowindex = this.table.rows.findIndex(selectedRow => selectedRow.name === row.name);
    moveItemInArray(this.table.rows, this.bridgeService.draggedRowIndex, replacerowindex);
    this.updateRowsIndexesAnsSaveChanges();
  }
  
  ngAfterViewInit() {
  }

  getAllPanelRowNames(){
    let existingRowNames = [];
    this.tables.forEach(tbl => {
      const tblRowNames = tbl.rows.reduce((prev, cur) => {
        prev.push(cur.name);
        return prev.concat(cur.grouppedFields.map(item => item.name));
      }, []);
      existingRowNames = existingRowNames.concat(tblRowNames);
    });
    return uniq(existingRowNames);
  }

  createGroup() {
    if (!this.validateGroupFields()){
      return;
    };
    const existingRowNames =  this.getAllPanelRowNames();
    this.groupDialogOpened = true;
    const matDialog = this.matDialog.open(OpenSaveDialogComponent, {
      closeOnNavigation: false,
      disableClose: true,
      panelClass: 'cdm-version-dialog',
      data: {
        header: 'Create Group',
        label: 'Name',
        okButton: 'Save',
        type: 'input',
        existingNames: existingRowNames,
        errorMessage: 'This name already exists'
      }
    });
    matDialog.afterClosed().subscribe(res => {
      if (res.action) {
        const fieldsToGroup = this.rowFocusedElements.map(item => item.id);
        const groupType = this.table.rows.find(item => item.name === fieldsToGroup[ 0 ]).type;
        const groupRows = this.table.rows.filter(item => fieldsToGroup.includes(item.name)) as Row[];
        const rowOptions: RowOptions = {
          id: 0,
          tableId: this.table.id,
          tableName: this.table.name,
          name: res.value,
          type: groupType.substr(0, groupType.indexOf('(')),
          isNullable: true,
          comments: [],
          uniqueIdentifier: false,
          area: Area.Source,
          grouppedFields: groupRows,
          visible: true
        };
        const groupRow = new Row(rowOptions);
        this.table.rows = this.table.rows.filter(item => !fieldsToGroup.includes(item.name));
        this.table.rows.unshift(groupRow);

        this.removeRowsFromSimilarTable(fieldsToGroup);
        this.updateRowsIndexesAnsSaveChanges();
      }
      this.groupDialogOpened = false;
    });
  }

  validateGroupFields(groupType?: string) {
    const linkedTargetTables = uniq(this.checkLinks());
    if (linkedTargetTables.length) {
      const dialog = this.matDialog.open(ErrorPopupComponent, {
        closeOnNavigation: false,
        disableClose: false,
        data: {
          title: 'Grouping error',
          message: `You cannot add linked fields to Group. Thare are links in the following tables: ${linkedTargetTables.join(",").toUpperCase()}`
        }
      });

      dialog.afterClosed().subscribe(res => {
        return false;
      });
    } else if (this.checkGrouppedFields()) {

      const dialog = this.matDialog.open(ErrorPopupComponent, {
        closeOnNavigation: false,
        disableClose: false,
        data: {
          title: 'Grouping error',
          message: 'You cannot add groupped field to Group.'
        }
      });

      dialog.afterClosed().subscribe(res => {
        return false;
      });

    } else if (this.checkDifferentTypes(groupType)) {

      const dialog = this.matDialog.open(ErrorPopupComponent, {
        closeOnNavigation: false,
        disableClose: false,
        data: {
          title: 'Grouping error',
          message: 'You cannot add fields of different types to Group. Types should be similar.'
        }
      });

      dialog.afterClosed().subscribe(res => {
        return false;
      });
    } else {
      return true;
    }
  }

  checkLinks() {
    const linkedTables = [];
    this.rowFocusedElements.forEach(item =>
      this.storeService.state.target.forEach(tbl => {
        if (this.bridgeService.rowHasAnyConnection(this.table.rows.find(r => r.name === item.id), this.area, tbl.id)) {
          linkedTables.push(tbl.name)
        }
      }))
    return linkedTables;
  }

  checkGrouppedFields() {
    return this.rowFocusedElements.some(item => this.table.rows.find(r => r.name === item.id).grouppedFields.length);
  }

  checkDifferentTypes(groupType?: string) {
    let typesArray = [];
    if (groupType) {
      typesArray = Object.values(Object.fromEntries(Object.entries(this.fieldTypes).
        filter(([ k, v ]) => v.includes(groupType))));
    } else {
      const firstGroupRowType = this.table.rows.find(r => r.name === this.rowFocusedElements[ 0 ].id).type
      typesArray = Object.values(Object.fromEntries(Object.entries(this.fieldTypes).
        filter(([ k, v ]) => v.includes(firstGroupRowType.substr(0, firstGroupRowType.indexOf('('))))));
    }
    return this.rowFocusedElements.some(item => {
      const rowType = this.table.rows.find(r => r.name === item.id).type.toLowerCase();
      return !typesArray[ 0 ].includes(rowType.substr(0, rowType.indexOf('(')))
    }
    );
  }

  addRowToGroup(rows: IRow[]) {
    const group = rows[ 0 ];
    const focusedRowsNames = this.rowFocusedElements.map(item =>item.id);
    const rowsToAdd = this.table.rows.filter(item => focusedRowsNames.includes(item.name));
    if (!this.validateGroupFields(group.type)) {
      return;
    };
    rowsToAdd.forEach(rowToAdd => {
      const addedRowIndex = this.table.rows.findIndex(item => item.name === rowToAdd.name);
      this.table.rows.find(item => item.name === group.name).grouppedFields.splice(0, 0, rowToAdd);
      this.table.rows.splice(addedRowIndex, 1);
      this.bridgeService.saveChangesInGroup(group.tableName, this.table.rows);
      this.removeRowsFromSimilarTable([ rowToAdd.name ]);
    })
    this.refreshPanel();
  }

  removeGroup(row: IRow) {
    const dialog = this.matDialog.open(DeleteWarningComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog',
      data: {
        title: 'group',
        message: `Group ${row.name} will be deleted`,
      }
    });
    dialog.afterClosed().subscribe(res => {
      if (res) {
        while (row.grouppedFields.length) {
          this.removeFromGroup(row, row.grouppedFields[ 0 ]);
        }
        this.bridgeService.arrowsCache = Object.fromEntries(Object.entries(this.bridgeService.arrowsCache).
          filter(([ k, v ]) => !(v.source.tableName === row.tableName && v.source.name === row.name)));
      }
    });
  }

  removeRowsFromSimilarTable(fieldsToGroup: string[]) {
    const similarTableIndex = this.tables.findIndex(item => item.name === 'similar');
    if (similarTableIndex !== -1) {
      fieldsToGroup.forEach(item => {
        const srows = this.bridgeService.findSimilarRows(this.tables.
          filter(tbl => tbl.name !== 'similar' && tbl.name !== this.table.name), item);

        if (srows.length <= 1) {
          this.tables[ similarTableIndex ].rows = this.tables[ similarTableIndex ].rows.filter(r => r.name !== item);
          this.bridgeService.arrowsCache = Object.fromEntries(Object.entries(this.bridgeService.arrowsCache).
            filter(([ k, v ]) => !(v.source.tableName === 'similar' && v.source.name === item)));
        }
      })
    }
  }

  addRowsToSimilarTable(rowToAdd: IRow) {
    const similarTable = this.tables.find(item => item.name === 'similar');
    if (similarTable) {
      const srows = this.bridgeService.findSimilarRows(this.tables.
        filter(tbl => tbl.name !== 'similar'), rowToAdd.name);
      if (srows.length > 1) {
        rowToAdd.tableName = 'similar';
        rowToAdd.tableId = similarTable.id;
        similarTable.rows.push(rowToAdd);
      }
    }
  }

  removeFromGroup(detail: IRow, row: IRow) {
    const removedRow = detail.grouppedFields.find(item => item.name === row.name);
    const removedRowIdx = detail.grouppedFields.findIndex(item => item.name === row.name);
    const rowIndex = this.table.rows.findIndex(item => item.name === detail.name);
    this.table.rows[ rowIndex ].grouppedFields.splice(removedRowIdx, 1);
    if (this.table.rows[ rowIndex ].grouppedFields.length === 0) {
      this.table.rows.splice(rowIndex, 1);
    }
    const insertIndex = this.table.rows.findIndex(item => item.grouppedFields.length === 0);
    this.table.rows.splice(insertIndex, 0, removedRow);
    this.addRowsToSimilarTable(cloneDeep(removedRow));
    this.updateRowsIndexesAnsSaveChanges();

  }

  updateRowsIndexesAnsSaveChanges() {
    if (this.area === 'source') {
      if (this.table.name === 'similar') {
        this.storeService.state.sourceSimilar = this.table.rows;
      } else {
        this.storeService.state.source.find(item => item.name === this.table.name).rows = this.table.rows;
      }
    } else {
      if (this.table.name === 'similar') {
        this.storeService.state.targetSimilar = this.table.rows;
      } else {
        const targetClones = this.storeService.state.targetClones[ this.table.name ];
        if (targetClones) {
          const storedTarget = this.storeService.state.target.find(item => item.name === this.table.name && item.cloneName === this.table.cloneName);
          storedTarget ? storedTarget.rows = this.table.rows :
            targetClones.find(item => item.cloneName === this.table.cloneName).rows = this.table.rows;
        } else {
          this.storeService.state.target.find(item => item.name === this.table.name).rows = this.table.rows;
        }
      }
    }
    this.refreshPanel();
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
      row.increment = !row.increment;
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
      const value = row.increment;
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
    this.setRowFocus($event.currentTarget, $event.ctrlKey);
  }

  setRowFocus(target, ctrlKey) {
    if (target) {
      const targetFocused = this.rowFocusedElements.find(item => item.id === target.id);
      if (!ctrlKey) {
        if (!targetFocused) {this.unsetRowFocus();}
      }
      else {
        if (targetFocused) {
          targetFocused.classList.remove('row-focus');
          this.rowFocusedElements = this.rowFocusedElements.filter(item => item.id !== target.id)
        }
      }
      if(!targetFocused){
        this.rowFocusedElements.push(target);
        this.rowFocusedElements[ this.rowFocusedElements.length - 1 ].classList.add('row-focus');
      }
    }
  }

  unsetRowFocus() {
    const focused: HTMLAllCollection = this.elementRef.nativeElement.querySelectorAll('.row-focus');
    Array.from(focused).forEach((it: HTMLElement) => it.classList.remove('row-focus'));
    this.rowFocusedElements = [];
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
