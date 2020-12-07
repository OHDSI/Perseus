import { Component, AfterViewInit, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

import { BridgeButtonData } from '../bridge-button/model/bridge-button-data';
import { BridgeButtonService } from '../bridge-button/service/bridge-button.service';
import { SampleDataPopupComponent } from '../popups/sample-data-popup/sample-data-popup.component';
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
  styleUrls: ['./panel.component.scss']
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
    this.searchCriteria = this.linkFieldsSearch[this.linkFieldsSearchKey];

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
    if(this.panel.rowFocusedElements.length){
    this.panel.createGroup();
    }
  }

  onClose() {
    if (!this.initializing) {
      this.close.emit();
    }
  }

  openSampleDataDialog(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dialog.open(SampleDataPopupComponent, {
      width: '1021px',
      height: '696px',
      data: this.table
    });
  }

  onOpenTransfromDialog(event: any) {
    const {row, element} = event;

    const connections = this.bridgeService.findCorrespondingConnections(
      this.table,
      row
    );
    if (connections.length > 0) {
      const payload: BridgeButtonData = {
        connector: connections[0].connector,
        arrowCache: this.bridgeService.arrowsCache
      };

      this.bridgeButtonService.init(payload, element);
      this.bridgeButtonService.openRulesDialog();
    }
  }

  filterByName(byName: Criteria): void {
    const filterByName = (name, index?) => {
      return name.toUpperCase().indexOf(byName.criteria.toUpperCase()) > -1;
    };

    this.filtered = this.table.rows.map(item => item.name).filter(filterByName);
    this.linkFieldsSearch[this.linkFieldsSearchKey] = byName.criteria;
    this.searchCriteria = byName.criteria;
    this.storeService.add('linkFieldsSearch', this.linkFieldsSearch);
  }

  filterByNameReset(byName: Criteria): void {
    this.filtered = undefined;
    this.linkFieldsSearch[this.linkFieldsSearchKey] = '';
    this.searchCriteria = '';
    this.storeService.add('linkFieldsSearch', this.linkFieldsSearch);
  }

  openOnBoardingTip(target: EventTarget) {
    this.commonUtilsService.openOnBoardingTip(target, 'create-group');
  }

  openConditionDialog(data) {

    const matDialog = this.matDialog.open(TargetCloneDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'sql-editor-dialog',
      data : {table: this.table}
    });
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

        const cloneTargetTable = cloneDeep(this.table) as ITable;
        cloneTargetTable.cloneName = res.value;
        const cloneTableId = this.storeService.state.targetClones[ this.table.name ] ?
          this.storeService.state.target.length + this.storeService.state.targetClones[ this.table.name ].length : this.storeService.state.target.length;
        cloneTargetTable.id = cloneTableId;
        cloneTargetTable.rows.forEach(item => {
          item.tableId = cloneTableId;
          item.htmlElement = null;
          item.cloneTableName = cloneTargetTable.cloneName;
          item.cloneDisabled = true;
        });
        if (!this.storeService.state.targetClones[ this.table.name ]) {
          this.storeService.state.targetClones[ this.table.name ] = [ cloneTargetTable ];
          this.table.cloneName = 'Default';
          this.table.rows.forEach(element => {
            element.cloneDisabled = false;
            element.cloneTableName = 'Default';
          });
          this.storeService.state.target.find(item => item.name === this.table.name).cloneName = 'Default';
          this.storeService.state.target.find(item => item.name === this.table.name).rows.forEach(element => {
            element.cloneDisabled = false;
            element.cloneTableName = 'Default';
          });
        } else {
          this.storeService.state.targetClones[ this.table.name ].push(cloneTargetTable);
        }

        this.bridgeService.drawCloneArrows(cloneTargetTable, this.table);

      }

    });
  }

  getTableCloneNames() {
    if (this.storeService.state.targetClones[ this.table.name ]) {
      return this.storeService.state.targetClones[ this.table.name ].map(item => item.cloneName).
      concat([this.tables.find(item => item.name === this.table.name).cloneName]);
    }
  }

  openClonesDropdown(target: any, area: string) {
    const data = {
      tables: [ this.tables.find(item => item.name === this.table.name) ].concat(this.storeService.state.targetClones[ this.table.name ]),
      selected: this.table,
      clone: true,
      previous: undefined
    };

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'filter-popup',
      positionStrategyFor: 'table-dropdown',
      payload: data
    };
    const overlayRef = this.overlayService.open(dialogOptions, target, SelectTableDropdownComponent);

    overlayRef.afterClosed$.subscribe( tbl => {
      const storedTarget = this.storeService.state.targetClones[ data.previous.name ].find(item => item.id === data.previous.id) ?
      this.storeService.state.targetClones[ data.previous.name ].find(item => item.id === data.previous.id):
      this.storeService.state.target.find(item => item.id === data.previous.id);
      storedTarget.rows.forEach(element => {
          element.cloneDisabled = true;
        });
      this.updateArrowCache(storedTarget.name, storedTarget.cloneName, true);

      data.selected.rows.forEach(element => {
        element.cloneDisabled = false;
      });
      this.updateArrowCache(data.selected.name, data.selected.cloneName, false);

      this.table = data.selected;
      this.changeClone.emit(data.selected);
    });

  }

  updateArrowCache(targetTableName: string, cloneName: string, disabledStatus: boolean) {
      Object.values(this.bridgeService.arrowsCache).
      filter(item => item.target.tableName === targetTableName && item.target.cloneTableName === cloneName).
      forEach(it => it.target.cloneDisabled = disabledStatus);
  }

}
