import { Injectable } from '@angular/core';
import { DrawService } from 'src/app/services/draw.service';
import { IRow, Row } from 'src/app/models/row';
import {
  ArrowCache,
  Arrow,
  ConstantCache,
  CorrespondingRows
} from '../models/arrow-cache';
import { MappingService } from '../models/mapping-service';
import { ITable } from '../models/table';
import { Subject } from 'rxjs';
import { uniqBy, cloneDeep } from '../infrastructure/utility';
import { Configuration } from '../models/configuration';
import { StateService } from './state.service';
import { BridgeButtonService } from './bridge-button.service';
import { UserSettings } from './user-settings.service';
import { IConnector } from '../models/interface/connector.interface';
import { SqlFunction } from '../components/popaps/rules-popup/transformation-input/model/sql-string-functions';
import { Command } from '../infrastructure/command';
import { TransformationConfig } from '../components/vocabulary-transform-configurator/model/transformation-config';

export interface IConnection {
  source: IRow;
  target: IRow;
  connector: IConnector;
  transforms?: SqlFunction[];
  transformationConfigs?: TransformationConfig[];
}

@Injectable()
export class BridgeService {
  set sourceRow(row: IRow) {
    this.sourcerow = row;
  }
  get sourceRow() {
    return this.sourcerow;
  }

  set targetRow(row: IRow) {
    this.targetrow = row;
  }
  get targetRow() {
    return this.targetrow;
  }

  get targetRowElement() {
    return this.targetrowrlement;
  }
  set targetRowElement(element: HTMLElement) {
    this.targetrowrlement = element;
  }

  constructor(
    private drawService: DrawService,
    private bridgeButtonService: BridgeButtonService,
    private userSettings: UserSettings,
    private stateService: StateService
  ) {}
  applyConfiguration$ = new Subject<Configuration>();
  resetAllMappings$ = new Subject<any>();

  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrowsCache: ArrowCache = {};
  constantsCache: ConstantCache = {};
  connection = new Subject<IConnection>();
  removeConnection = new Subject<IConnection>();

  deleteAll = new Subject();

  connect = new Command({
    execute: () => {
      const entityId = this.getConnectorId(this.sourceRow, this.targetRow);

      const connector = this.drawService.drawLine(
        entityId,
        this.sourceRow,
        this.targetRow
      );

      if (this.userSettings.showQuestionButtons) {
        this.bridgeButtonService.createButton(connector, this.arrowsCache);
      }

      const connection: IConnection = {
        source: this.sourceRow,
        target: this.targetRow,
        transforms: [],
        connector
      };

      this.arrowsCache[connector.id] = connection;

      this.connection.next(connection);
    },
    canExecute: () => {
      const connectorId = this.getConnectorId(this.sourceRow, this.targetRow);

      return this.arrowsCache[connectorId] ? false : true;
    }
  });

  addConstant = new Command({
    execute: (row: IRow) => {
      this.constantsCache[this.getConstantId(row)] = row;
    },
    canExecute: () => true
  });

  applyConfiguration(configuration: Configuration) {
    this.deleteAllArrows();

    this.arrowsCache = Object.assign(configuration.arrows);

    this.applyConfiguration$.next(configuration);
  }

  adjustArrowsPositions() {
    const { list } = this.drawService;

    Object.keys(list).forEach(key => {
      const drawEntity: IConnector = list[key];
      drawEntity.adjustPosition();

      if (this.userSettings.showQuestionButtons) {
        Promise.resolve(null).then(_ => {
          this.bridgeButtonService.recalculateButtonPosition(drawEntity);
        });
      }
    });
  }

  recalculateConnectorsPositions() {
    if (!this.drawService.listIsEmpty) {
      this.adjustArrowsPositions();
    }
  }

  getStyledAsDragStartElement() {
    this.sourceRow.htmlElement.classList.add('drag-start');
  }

  getStyledAsDragEndElement() {
    this.sourceRow.htmlElement.classList.remove('drag-start');
  }

  refresh(table: ITable[], delayMs?: number) {
    this.hideAllArrows();

    if (delayMs) {
      setTimeout(() => {
        this._refresh(table, this.arrowsCache, this.stateService);
      }, delayMs);
    } else {
      this._refresh(table, this.arrowsCache, this.stateService);
    }
  }

  private _refresh(
    table: ITable[],
    arrowsCache: ArrowCache,
    stateService: StateService
  ) {
    const tablenamesString = table.map(t => t.name).join(',');

    Object.values(arrowsCache).forEach((arrow: Arrow) => {
      if (tablenamesString.indexOf(arrow.target.tableName) > -1) {
        const source = stateService.findTable(arrow.source.tableName);
        const target = stateService.findTable(arrow.target.tableName);

        this.initializeConnector(arrow, source, target);
      }
    });
  }

  refreshAll() {
    this.hideAllArrows();

    setTimeout(() => {
      Object.values(this.arrowsCache).forEach((arrow: Arrow) => {
        const source = this.stateService.findTable(arrow.source.tableName);
        const target = this.stateService.findTable(arrow.target.tableName);

        this.initializeConnector(arrow, source, target);
      });
    }, 300);
  }

  initializeConnector(arrow, source, target) {
    if (source.expanded && target.expanded) {
      const connector = this.drawService.drawLine(
        this.getConnectorId(arrow.source, arrow.target),
        arrow.source,
        arrow.target
      );

      this.arrowsCache[connector.id].connector = connector;

      if (this.userSettings.showQuestionButtons) {
        this.bridgeButtonService.createButton(connector, this.arrowsCache);
      }
    }
  }

  deleteArrow(key: string) {
    const savedConnection = cloneDeep(this.arrowsCache[key]);

    this.drawService.deleteConnector(key);

    if (this.arrowsCache[key]) {
      delete this.arrowsCache[key];
    }

    this.removeConnection.next(savedConnection);
  }

  deleteArrowsForMapping(targetTableName: string, sourceTableName: string) {
    Object.keys(this.arrowsCache).forEach(key => {
      if (
        this.arrowsCache[key].target.tableName.toUpperCase() ===
          targetTableName.toUpperCase() &&
        this.arrowsCache[key].source.tableName.toUpperCase() ===
          sourceTableName.toUpperCase()
      ) {
        delete this.arrowsCache[key];

        // If target and source are switched
      } else if (
        this.arrowsCache[key].target.tableName.toUpperCase() ===
          sourceTableName.toUpperCase() &&
        this.arrowsCache[key].source.tableName.toUpperCase() ===
          targetTableName.toUpperCase()
      ) {
        delete this.arrowsCache[key];
      }
    });
  }

  hideAllArrows(): void {
    this.drawService.deleteAllConnectors();
  }

  hideTableArrows(table: ITable): void {
    this.drawService.deleteConnectorsBoundToTable(table);
  }

  deleteAllArrows() {
    Object.values(this.arrowsCache).forEach(arrow => {
      this.deleteArrow(arrow.connector.id);
    });

    this.deleteAll.next();
  }

  deleteSelectedArrows() {
    Object.values(this.arrowsCache)
      .filter(arrow => arrow.connector.selected)
      .forEach(arrow => {
        this.deleteArrow(arrow.connector.id);
      });

    this.deleteAll.next();
  }

  generateMapping() {
    const mappingService = new MappingService(
      this.arrowsCache,
      this.constantsCache
    );
    return mappingService.generate();
  }

  isTableConnected(table: ITable): boolean {
    return (
      Object.values(this.arrowsCache).filter(connection => {
        return (
          connection.source.tableName === table.name ||
          connection.target.tableName === table.name
        );
      }).length > 0
    );
  }

  isRowConnected(row: IRow): boolean {
    return (
      Object.values(this.arrowsCache).filter(connection => {
        return connection.source.id === row.id;
      }).length > 0
    );
  }

  findCorrespondingTables(table: ITable): string[] {
    const source = table.area === 'source' ? 'target' : 'source';
    const rows = Object.values(this.arrowsCache)
      .filter(connection => {
        return connection[table.area].tableName === table.name;
      })
      .map(arrow => arrow[source]);

    return uniqBy(rows, 'tableName').map(row => row.tableName);
  }

  findCorrespondingRows(table: ITable, row: IRow): CorrespondingRows[] {
    return [{ row: new Row() }];
  }

  resetAllMappings() {
    this.deleteAllArrows();

    this.resetAllMappings$.next();
  }

  getConnectorId(source: IRow, target: IRow): string {
    const sourceRowId = source.id;
    const targetRowId = target.id;
    const sourceTableId = source.tableId;
    const targetTableId = target.tableId;

    return `${sourceTableId}-${sourceRowId}/${targetTableId}-${targetRowId}`;
  }

  getConstantId(target: IRow): string {
    const targetRowId = target.id;
    const targetTableId = target.tableId;

    return `${targetTableId}-${targetRowId}`;
  }
}
