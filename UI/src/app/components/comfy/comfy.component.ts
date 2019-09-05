import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { StateService } from 'src/app/services/state.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  copyArrayItem
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { MappingPopupComponent } from '../popaps/mapping-popup/mapping-popup.component';
import { IRow } from 'src/app/models/row';
import { ITable } from 'src/app/models/table';
import { Configuration } from 'src/app/models/configuration';
import { BridgeService } from 'src/app/services/bridge.service';

@Component({
  selector: 'app-comfy',
  templateUrl: './comfy.component.html',
  styleUrls: ['./comfy.component.scss']
})
export class ComfyComponent implements OnInit {
  busy = true;

  get state() {
    return this.stateService.state;
  }

  get sourceTables(): ITable[] {
    return this.state.source.tables;
  }

  get targetTableNames(): string[] {
    return Object.keys(this.target);
  }

  get highlitedTables(): string[] {
    return this.highlitedtables;
  }
  private highlitedtables: string[] = [];

  source = [];
  target = {};
  sourceConnectedTo = [];
  sourceRows = [];

  constructor(
    private dataService: DataService,
    private stateService: StateService,
    private mappingDialog: MatDialog,
    private bridgeService: BridgeService
  ) {}

  ngOnInit() {
    this.dataService.initialize().subscribe(_ => {
      this.initialize();
      this.busy = false;
    });
  }

  initialize() {
    this.source = [];
    this.target = {};

    const prefix = 'target';
    this.source = this.state.source.tables.map(table => table.name);
    this.state.target.tables.map(table => {
      this.target[table.name] = {};
      this.target[table.name].name = `${prefix}-${table.name}`;
      this.target[table.name].first = table.name;
      this.target[table.name].data = [table.name];
    });

    this.sourceConnectedTo = this.state.target.tables.map(
      table => `${prefix}-${table.name}`
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const targetname = event.container.id.split('-')[1];

      this.setFirstElementAlwaysOnTop(targetname);
    }
}

  setFirstElementAlwaysOnTop(targetname: string): void {
    if (!targetname) {
      return;
    }

    const { data, first } = this.target[targetname];
    const index = data.findIndex(value => value === first);
    const temp = data[0];
    data[0] = first;
    data[index] = temp;
  }

  openMapping(targetTableName: string): void {
    const targettable = this.state.target.tables.filter(
      table => table.name === targetTableName
    );
    const { data } = this.target[targetTableName];

    const sourcetable = this.state.source.tables.filter(table => {
      const sourceTablesNames = data.slice(1, data.length);
      const index = sourceTablesNames.findIndex(name => name === table.name);
      return index > -1;
    });
    const dialog = this.mappingDialog.open(MappingPopupComponent, {
      width: '90vw',
      height: '90vh',
      data: { source: sourcetable, target: targettable }
    });

    dialog.afterClosed().subscribe(save => {});
  }

  findTables(selectedSourceColumns: string[]): void {
    const indexes = {};

    this.state.source.tables.forEach(table => {
      indexes[table.name] = selectedSourceColumns.map(
        columnname => table.rows.findIndex(r => r.name === columnname)
      );
    });

    this.highlitedtables = Object.keys(indexes).filter(
      tableName => {
        return indexes[tableName].length > 0 && !(indexes[tableName].findIndex(idx => idx === -1) > -1);
      }
    );

    this.source = Object.assign([], this.source);
  }

  removeTableMapping(event: any, tableName: string, targetTableName: string) {
    event.stopPropagation();

    const { data } = this.target[targetTableName];

    const index = data.findIndex(tablename => tablename === tableName);

    if (index > -1) {
      data.splice(index, 1);
    }
  }

  resetAllMappings() {
    this.initialize();
  }

  loadConfiguration(configuration: Configuration) {
    const arrowsConfiguration = JSON.parse(configuration.mappingsConfiguration);
    const tablesConfiguration = JSON.parse(configuration.tablesConfiguration);

    this.target = tablesConfiguration;
    this.bridgeService.applyConfiguration(arrowsConfiguration);
  }
}
