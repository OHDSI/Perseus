import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { MatDialog, MatExpansionPanel } from '@angular/material';

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
export class PanelComponent implements OnInit, AfterViewInit {
  @Input() table: ITable;

  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() initialized = new EventEmitter();

  @ViewChild('exppanelheader') panelHheader: any;
  @ViewChild('matpanel') panel: MatExpansionPanel;

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


  ngAfterViewInit() {
    this.initialized.emit();
  }

  ngOnInit() {
    this.bridgeService.deleteAll.subscribe(_ => {
      this.panelHheader._element.nativeElement.classList.remove(
        'table-has-a-link-true'
      );
    });

    this.bridgeService.connection.subscribe(_ => {
      if (this.bridgeService.isTableConnected(this.table)) {
        this.panelHheader._element.nativeElement.classList.add(
          'table-has-a-link-true'
        );
      }
    });
  }

  onOpen() {
    this.commonService.expanded(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, true);

    this.open.emit();

    // setTimeout(() => {

    // }, 50);
  }

  onClose() {
    this.commonService.collapsed(this.area);
    this.setExpandedFlagOnSourceAndTargetTables(this.table, false);

    this.close.emit();

    // setTimeout(() => {

    // }, 50);
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
}
