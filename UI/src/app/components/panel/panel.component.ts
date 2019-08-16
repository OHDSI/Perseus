import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CommonService } from 'src/app/services/common.service';
import { ITable } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';
import { StateService } from 'src/app/services/state.service';
import { SampleDataPopupComponent } from '../popaps/sample-data-popup/sample-data-popup.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input() table: ITable;

  @ViewChild('exppanelheader') panel: any;

  get title() {
    return this.table.name;
  }

  get area() {
    return this.table.area;
  }

  constructor(
    public dialog: MatDialog,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    this.bridgeService.deleteAll.subscribe(_ => {
      this.panel._element.nativeElement.classList.remove('table-has-a-link-true');
    });

    this.bridgeService.connection.subscribe(_ => {
      if (this.bridgeService.hasConnection(this.table)) {
        this.panel._element.nativeElement.classList.add('table-has-a-link-true');
      }
    });
  }

  onOpen() {
    this.commonService.expanded(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, true);

    setTimeout(() => {
      this.bridgeService.refreshAll();
    }, 200);
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, false);

    setTimeout(() => {
      this.bridgeService.refreshAll();
      this.hideArrowsIfCorespondingTableasAreClosed(this.table);
    }, 200);
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

  setExpandedFlagOnSourceAndTargetTables(table: ITable, expanded: boolean) {
    this.stateService.state[table.area].tables
      .filter(t => t.id === table.id)
      .forEach(t => (t.expanded = expanded));
  }

  hideArrowsIfCorespondingTableasAreClosed(table: ITable) {
    const corespondingTableNames = this.bridgeService.findCorrespondingTables(
      table
    );

    corespondingTableNames.forEach(name => {
      const correspondentTable = this.stateService.findTable(name);
      if (!correspondentTable.expanded && !table.expanded) {
        this.bridgeService.deleteTableArrows(table);
      }
    });
  }
}
