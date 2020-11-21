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
    private commonUtilsService: CommonUtilsService
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
}
