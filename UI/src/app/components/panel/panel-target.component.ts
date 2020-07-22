import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';

import { CommonService } from 'src/app/services/common.service';
import { StoreService } from 'src/app/services/store.service';
import { BridgeButtonService } from '../bridge-button/service/bridge-button.service';
import { PanelTableComponent } from './panel-table/panel-table.component';
import { PanelBaseComponent } from './panel-base.component';
import * as groupsConf from './groups-conf.json';

@Component({
  selector: 'app-panel-target',
  templateUrl: './panel-target.component.html',
  styleUrls: ['./panel-target.component.scss']
})
export class PanelTargetComponent extends PanelBaseComponent implements OnInit {
  @ViewChildren('panel') panels: QueryList<PanelTableComponent>;

  constructor(
    public dialog: MatDialog,
    commonService: CommonService,
    bridgeService: BridgeService,
    bridgeButtonService: BridgeButtonService,
    storeService: StoreService
  ) {
    super(dialog, commonService, bridgeService, bridgeButtonService, storeService);
  }

  groups: object;

  ngOnInit() {
    super.ngOnInit();

    const concept = [];
    const common = [];
    const individual = [];

    for (const item of this.table.rows) {
      if (groupsConf['concept'].includes(item.name)) {
        concept.push(item);
      } else if (groupsConf['common'].includes(item.name)) {
        common.push(item);
      } else {
        individual.push(item);
      }
    }

    this.groups = {
      concept: {...this.table, rows: concept, expanded: !!concept.length},
      common: {...this.table, rows: common, expanded: !!common.length},
      individual: {...this.table, rows: individual, expanded: !!individual.length}
    };
  }
}
