import { Component, AfterViewInit, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITable, Table } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

import { BridgeButtonData } from '../bridge-button/model/bridge-button-data';
import { BridgeButtonService } from '../bridge-button/service/bridge-button.service';
import { PanelTableComponent } from './panel-table/panel-table.component';
import { Criteria } from '../../common/components/search-by-name/search-by-name.component';
import { StoreService } from '../../services/store.service';
import { CommonUtilsService } from 'src/app/services/common-utils.service';
import { TargetCloneDialogComponent } from '../target-clone-dialog/target-clone-dialog.component';
import { cloneDeep } from 'src/app/infrastructure/utility';
import { OpenSaveDialogComponent } from '../popups/open-save-dialog/open-save-dialog.component';
import { SelectTableDropdownComponent } from '../popups/select-table-dropdown/select-table-dropdown.component';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: [ './panel.component.scss' ]
})
export class PanelComponent implements OnInit, AfterViewInit {
  @Input() table: ITable;
  @Input() tabIndex: number;
  @Input() tables: ITable[];
  @Input() oppositeTableId: any;
  @Input() filteredFields: any;
  @Input() mappingConfig: any;

  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() initialized = new EventEmitter();
  @Output() openTransform = new EventEmitter();
  @Output() changeClone = new EventEmitter<any>();

  @ViewChild('panel') panel: PanelTableComponent;

  get title() {
    return this.table.name;
  }

  get area() {
    return this.table.area;
  }

  get oppositeTableName() {
    const oppositeTable = this.storeService.state.source.find(item => item.id === this.oppositeTableId);
    if (oppositeTable) {
      return oppositeTable.name;
    }
    return undefined;
  }

  get existingClones() {
    const clones = this.storeService.state.targetClones[ this.table.name ];
    if (clones) {
      return clones.filter(item => item.cloneConnectedToSourceName === this.oppositeTableName);
    }
  }

  initializing: boolean;
  filtered;
  linkFieldsSearch = {};
  linkFieldsSearchKey = '';
  searchCriteria: string;

  constructor(
    public dialog: MatDialog,
    private bridgeService: BridgeService,
    private bridgeButtonService: BridgeButtonService,
    private storeService: StoreService,
    private commonUtilsService: CommonUtilsService,
    private matDialog: MatDialog,
    private overlayService: OverlayService
  ) {
    this.initializing = true;
  }

  ngOnInit() {
    this.linkFieldsSearchKey = `${this.table.name}Search`;
    this.linkFieldsSearch = this.storeService.state.linkFieldsSearch;
    this.searchCriteria = this.linkFieldsSearch[ this.linkFieldsSearchKey ];

    this.filterAtInitialization();

    this.storeService.state$.subscribe(res => {
      if (res) {
        this.linkFieldsSearch = res.linkFieldsSearch;
      }
    });
  }

  ngAfterViewInit() {
    this.initialized.emit();
    this.initializing = false;
  }

  filterAtInitialization() {
    if (this.searchCriteria) {
      const searchCriteria: Criteria = {
        filtername: 'by-name',
        criteria: this.searchCriteria
      };
      this.filterByName(searchCriteria);
    }
  }

  onOpen() {
    if (!this.initializing) {
      this.open.emit();
    }
  }

  createGroup() {
    if (this.panel.rowFocusedElements.length) {
      this.panel.createGroup();
    }
  }

  onClose() {
    if (!this.initializing) {
      this.close.emit();
    }
  }

  onOpenTransfromDialog(event: any) {
    const { row, element } = event;

    const connections = this.bridgeService.findCorrespondingConnections(
      this.table,
      row
    );
    if (connections.length > 0) {
      const payload: BridgeButtonData = {
        connector: connections[ 0 ].connector,
        arrowCache: this.bridgeService.arrowsCache
      };

      this.bridgeButtonService.init(payload, element);
      this.bridgeButtonService.openRulesDialog();
    }
  }

  filterByName(byName: Criteria): void {
    const filterByName = name => {
      return name.toUpperCase().indexOf(byName.criteria.toUpperCase()) > -1;
    };

    this.filtered = this.table.rows.map(item => item.name).filter(filterByName);
    this.linkFieldsSearch[ this.linkFieldsSearchKey ] = byName.criteria;
    this.searchCriteria = byName.criteria;
    this.storeService.add('linkFieldsSearch', this.linkFieldsSearch);
  }

  filterByNameReset(byName: Criteria): void {
    this.filtered = undefined;
    this.linkFieldsSearch[ this.linkFieldsSearchKey ] = '';
    this.searchCriteria = '';
    this.storeService.add('linkFieldsSearch', this.linkFieldsSearch);
  }

  openOnBoardingTip(target: EventTarget) {
    this.commonUtilsService.openOnBoardingTip(target, 'create-group');
  }

  openOnBoardingTipClone(target: EventTarget) {
    this.commonUtilsService.openOnBoardingTip(target, 'clone-target');
  }

  openConditionDialog() {

    const matDialog = this.matDialog.open(TargetCloneDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'sql-editor-dialog',
      data: { table: this.table, sourceTable: this.storeService.state.source.find(item => item.name === this.oppositeTableName) }
    });

    matDialog.afterClosed().subscribe(res => {
      if (res) {
        this.table.condition = res.condition;
        if (this.existingClones && this.existingClones.length) {
          const tableToUpdate = this.storeService.state.targetClones[ this.table.name ].find(item => item.id === this.table.id);
          this.updateCondition(tableToUpdate);
        } else {
          this.updateCondition(this.storeService.state.target.find(item => item.id === this.table.id));
        }
      }
    });
  }

  updateCondition(table: ITable) {
    table.condition = this.table.condition;
    table.rows.forEach(row => row.condition = this.table.condition);
    Object.values(this.bridgeService.arrowsCache)
      .filter(item => item.target.tableName === this.table.name && item.target.cloneTableName === this.table.cloneName)
      .forEach(el => el.target.condition = this.table.condition);
  }

  createClone() {
    const existingCloneNames = this.getTableCloneNames();
    const matDialog = this.matDialog.open(OpenSaveDialogComponent, {
      closeOnNavigation: false,
      disableClose: true,
      panelClass: 'cdm-version-dialog',
      data: {
        header: 'Clone Mapping',
        label: 'Name',
        okButton: 'Clone',
        type: 'input',
        existingNames: existingCloneNames,
        errorMessage: 'This name already exists'
      }
    });
    matDialog.afterClosed().subscribe(res => {
      if (res.action) {
        const cloneFromTableName = this.table.cloneName;
        if (!this.storeService.state.targetClones[ this.table.name ]) {
          this.storeService.state.targetClones[ this.table.name ] = [];
        }
        let cloneToSet;
        const cloneConnectedToSourceName = this.oppositeTableName;
        const totalNumberOfClones = Object.values(this.storeService.state.targetClones)
          .reduce((accumulator: number, currentValue: ITable[]) => accumulator + currentValue.length, 0);
        const cloneId = this.storeService.state.target.length + totalNumberOfClones;
        if (this.existingClones && this.existingClones.length) {
          cloneToSet = this.createClonedTable(this.table, res.value, cloneId, cloneConnectedToSourceName, cloneFromTableName);
          this.storeService.state.targetClones[ this.table.name ].
            push(cloneToSet);
        } else {
          const defaultClone = this.createClonedTable(this.table, 'Default', cloneId, cloneConnectedToSourceName, cloneFromTableName);
          this.storeService.state.targetClones[ this.table.name ].push(defaultClone);
          cloneToSet = this.createClonedTable(this.table, res.value, cloneId + 1, cloneConnectedToSourceName, cloneFromTableName);
          this.storeService.state.targetClones[ this.table.name ].
            push(cloneToSet);
        }
        this.setCloneTable(cloneToSet);
        Object.values(this.bridgeService.constantsCache)
          .filter(it => it.tableName === this.table.name && it.cloneTableName === undefined)
          .forEach(constant => delete this.bridgeService.constantsCache[ this.bridgeService.getConstantId(constant) ]);
      }
    });
  }

  cloneConcepts(cloneFromTableName: string, cloneToTableName: string) {
    const tableConcepts = this.storeService.state.concepts[`${this.table.name}|${this.oppositeTableName}`];

    if (tableConcepts) {
      const clonedConcepts = [];
      tableConcepts.conceptsList.forEach(it => {
        if (it.fields['concept_id'].targetCloneName === cloneFromTableName) {
          const clonedConcept = cloneDeep(it);
          clonedConcept.id = tableConcepts.conceptsList.length + clonedConcepts.length;
          Object.values(clonedConcept.fields).forEach(field => {
            (field as any).targetCloneName = cloneToTableName;
          });
          clonedConcepts.push(clonedConcept);
        }
      });

      tableConcepts.conceptsList = tableConcepts.conceptsList.concat(clonedConcepts);
    }
  }

  updateClonedTableProperties(table: ITable, cloneName: string, cloneConnectedToSourceName: string) {
    table.cloneName = cloneName;
    table.cloneConnectedToSourceName = cloneConnectedToSourceName;
    this.table.rows.forEach(element => {
      element.cloneTableName = cloneName;
      element.cloneConnectedToSourceName = cloneConnectedToSourceName;
    });
  }


  createClonedTable(table: ITable, cloneName: string, cloneId: number, cloneConnectedToSourceName: string, cloneFromTableName: string) {
    const cloneTargetTable = cloneDeep(table) as ITable;
    cloneTargetTable.cloneName = cloneName;
    cloneTargetTable.cloneConnectedToSourceName = cloneConnectedToSourceName;
    if (cloneName !== 'Default') {
      cloneTargetTable.condition = '';
    }
    cloneTargetTable.id = cloneId;
    cloneTargetTable.rows.forEach(item => {
      item.tableId = cloneId;
      item.cloneTableName = cloneName;
      item.cloneConnectedToSourceName = cloneConnectedToSourceName;
      if (cloneName !== 'Default') {
        item.condition = '';
      }
    });
    this.bridgeService.drawCloneArrows(cloneTargetTable, table, this.oppositeTableName);
    this.bridgeService.addCloneConstants(cloneTargetTable, table, this.oppositeTableName);
    this.cloneConcepts(cloneFromTableName, cloneName);
    return cloneTargetTable;
  }

  getTableCloneNames() {
    const tableClones = this.getTableClones();
    if (tableClones) {
      return tableClones.map(item => item.cloneName);
    }
  }

  getTableClones() {
    if (this.storeService.state.targetClones[ this.table.name ]) {
      return this.storeService.state.targetClones[ this.table.name ]
        .filter(it => it.cloneConnectedToSourceName === this.oppositeTableName);
    }
  }

  openClonesDropdown(target: any) {
    const data = {
      tables: this.getTableClones(),
      selected: this.table,
      clone: true,
      previous: undefined,
      remove: true,
      itemNotToRemove: 'Default'
    };

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'filter-popup',
      positionStrategyFor: 'table-dropdown',
      payload: data
    };
    const overlayRef = this.overlayService.open(dialogOptions, target, SelectTableDropdownComponent);

    overlayRef.afterClosed$.subscribe(tbl => {
      if (tbl) {
        if (tbl instanceof Table) {
          const table = tbl as Table;
          this.removeCloneConcepts(table);
          this.storeService.state.targetClones[ table.name ] = this.storeService.state.targetClones[ table.name ].filter(item => item.id !== table.id);
          const arrowsToDelete = Object.values(this.bridgeService.arrowsCache).filter(item => item.target.tableId === table.id);
          arrowsToDelete.forEach(arrow => this.bridgeService.deleteArrow(arrow.connector.id, true));
          if (!this.storeService.state.targetClones[ table.name ].length) {
            delete this.storeService.state.targetClones[ table.name ];
            const test = Object.values(this.bridgeService.arrowsCache).
              filter(it => it.target.tableName === table.name && it.source.tableId === this.oppositeTableId);
            test.forEach(arrow => this.bridgeService.deleteArrow(arrow.connector.id, true));
          } else {
            this.setCloneTable(this.storeService.state.targetClones[ table.name ][ 0 ]);
          }
        }
      } else {
        this.setCloneTable(data.selected);
      }
    });

  }

  removeCloneConcepts(table: any) {
    const tableConcepts = this.storeService.state.concepts[`${this.table.name}|${this.oppositeTableName}`];

    if (tableConcepts) {
      tableConcepts.conceptsList = tableConcepts.conceptsList.filter(it => it.fields['concept_id'].targetCloneName !== table.cloneName);
      tableConcepts.conceptsList.forEach((it, index) => {
        it.id = index;
      });
    }
  }

  setCloneTable(table) {
    this.table = table;
    this.changeClone.emit(table);
  }

}
