import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IRow, Row } from 'src/app/models/row';
import { DrawService } from 'src/app/services/draw.service';
import { SqlFunction } from '../components/popups/rules-popup/transformation-input/model/sql-string-functions';
import { TransformationConfig } from '../components/vocabulary-transform-configurator/model/transformation-config';
import { Command } from '../infrastructure/command';
import { cloneDeep, uniqBy } from '../infrastructure/utility';
import { Arrow, ArrowCache, ConstantCache } from '../models/arrow-cache';
import { Configuration } from '../models/configuration';
import { IConnector } from '../models/interface/connector.interface';
import { MappingService } from '../models/mapping-service';
import { ITable } from '../models/table';
import { StoreService } from './store.service';
import { Area } from '../models/area';

export interface IConnection {
  source: IRow;
  target: IRow;
  connector: IConnector;
  transforms?: SqlFunction[];
  transformationConfigs?: TransformationConfig[];
  type?: string;
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
    private storeService: StoreService
  ) {
  }

  applyConfiguration$ = new Subject<Configuration>();
  resetAllMappings$ = new Subject<any>();
  loadSavedSchema$ = new Subject<any>();
  saveAndLoadSchema$ = new Subject<any>();
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
      const similar = 'similar';
      this.drawArrow(this.sourceRow, this.targetRow);
      const similarSourceRows = this.findSimilarRows(this.sourceRow.name, Area.Source);
      const similarTargetRows = this.findSimilarRows(this.targetRow.name, Area.Target);
      const config = this.storeService.state.targetConfig;

      if (this.sourceRow.tableName === similar && this.targetRow.tableName !== similar) {
        similarSourceRows.forEach(row => {
          this.drawSimilar(config, row, this.targetRow);
        });
      }

      if (this.targetRow.tableName === similar && this.sourceRow.tableName !== similar) {
        similarTargetRows.forEach(row => {
          this.drawSimilar(config, this.sourceRow, row);
        });
      }

      if (this.sourceRow.tableName === similar && this.targetRow.tableName === similar) {
        similarSourceRows.forEach(sourceRow => {
          similarTargetRows.forEach(targetRow => {
            this.drawSimilar(config, sourceRow, targetRow);
          });
        });
      }
    },
    canExecute: () => {
      const connectorId = this.getConnectorId(this.sourceRow, this.targetRow);

      return !this.arrowsCache[ connectorId ];
    }
  });

  addConstant = new Command({
    execute: (row: IRow) => {
      this.constantsCache[ this.getConstantId(row) ] = row;
    },
    canExecute: () => true
  });

  drawSimilar(config, sourceRow, targetRow) {
    if (!this.canLink(config, sourceRow.tableName, targetRow.tableName)) {
      return;
    }
    this.drawArrow(sourceRow, targetRow);
  }

  canLink(config, name, key) {
    return config[key].data.includes(name);
  }

  findSimilarRows(name, area) {
    const tables = this.storeService.state[area];
    const similarRows = [];
    tables.forEach(table => {
      table.rows.forEach(row => {
        if (row.name === name) {
          similarRows.push(new Row({...row}));
        }
      });
    });

    return similarRows;
  }

  applyConfiguration(configuration: Configuration) {
    this.deleteAllArrows();

    this.arrowsCache = Object.assign(configuration.arrows);
    this.storeService.add('filtered', configuration.filtered);
    this.storeService.add('version', configuration.cdmVersion);
    this.storeService.add('target', configuration.targetTables);
    this.storeService.add('source', configuration.sourceTables);
    this.storeService.add('targetConfig', configuration.tables);
    this.storeService.add('report', configuration.reportName);

    this.applyConfiguration$.next(configuration);
  }

  adjustArrowsPositions() {
    const { list } = this.drawService;

    Object.keys(list).forEach(key => {
      const drawEntity: IConnector = list[ key ];
      drawEntity.adjustPosition();
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

  refresh(table: ITable, delayMs?: number) {
    this.hideAllArrows();

    if (delayMs) {
      setTimeout(() => {
        this._refresh(table, this.arrowsCache);
      }, delayMs);
    } else {
      this._refresh(table, this.arrowsCache);
    }
  }

  private _refresh(
    table: ITable,
    arrowsCache: ArrowCache
  ) {

    Object.values(arrowsCache).forEach((arrow: Arrow) => {
      if (table.name === arrow[ table.area ].tableName) {
        this.refreshConnector(arrow);
      }
    });
  }

  refreshAll() {
    this.hideAllArrows();

    setTimeout(() => {
      Object.values(this.arrowsCache).forEach((arrow: Arrow) => {
        this.refreshConnector(arrow);
      });
    }, 300);
  }

  refreshConnector(arrow) {
    const connector = this.drawService.drawLine(
      this.getConnectorId(arrow.source, arrow.target),
      arrow.source,
      arrow.target,
      arrow.type
    );

    this.arrowsCache[ connector.id ].connector = connector;

    this.connection.next(this.arrowsCache[ connector.id ]);
  }

  deleteArrow(key: string, force = false) {
    const savedConnection = cloneDeep(this.arrowsCache[ key ]);

    if (!savedConnection.connector.selected && !force) {
      return;
    }

    this.drawService.deleteConnector(key);

    if (this.arrowsCache[ key ]) {
      delete this.arrowsCache[ key ];
    }

    this.removeConnection.next(savedConnection);
  }

  deleteArrowsForMapping(targetTableName: string, sourceTableName: string) {
    Object.keys(this.arrowsCache).forEach(key => {
      const cache = this.arrowsCache[ key ];
      const { target: { tableName: cachedTargetTableName }, source: { tableName: cachedSourceTableName } } = cache;
      if (
        cachedTargetTableName.toUpperCase() === targetTableName.toUpperCase() &&
        cachedSourceTableName.toUpperCase() === sourceTableName.toUpperCase()
      ) {
        delete this.arrowsCache[ key ];

        // If target and source are switched
      } else if (
        cachedTargetTableName.toUpperCase() === sourceTableName.toUpperCase() &&
        cachedSourceTableName.toUpperCase() === targetTableName.toUpperCase()
      ) {
        delete this.arrowsCache[ key ];
      }
    });
  }

  drawArrow(sourceRow, targetRow, type = '') {
    const entityId = this.getConnectorId(sourceRow, targetRow);

    const connector = this.drawService.drawLine(
      entityId,
      sourceRow,
      targetRow,
      type
    );

    const connection: IConnection = {
      source: sourceRow,
      target: targetRow,
      transforms: [],
      connector,
      type
    };

    this.arrowsCache[ connector.id ] = connection;

    this.connection.next(connection);
  }

  hideAllArrows(): void {
    this.drawService.deleteAllConnectors();
  }

  hideTableArrows(table: ITable): void {
    this.drawService.deleteConnectorsBoundToTable(table);
  }

  deleteAllArrows() {
    Object.values(this.arrowsCache).forEach(arrow => {
      this.deleteArrow(arrow.connector.id, true);
    });

    this.deleteAll.next();
  }

  setArrowType(id: string, type: string) {
    const arrow = this.arrowsCache[ id ];
    arrow.connector.setEndMarkerType(type);
    arrow.type = type === 'None' ? '' : type;
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
        return connection.source.tableName === table.name || connection.target.tableName === table.name;
      }).length > 0
    );
  }

  rowHasAnyConnection(row: IRow, area, oppositeTableId): boolean {
    return (
      Object.values(this.arrowsCache).filter(connection => {
        const oppositeArea = Area.Source === area ? Area.Target : Area.Source;
        return connection[ area ].id === row.id &&
               connection[ area ].name === row.name &&
               connection[ oppositeArea ].tableId === oppositeTableId;
      }).length > 0
    );
  }

  isRowConnectedToTable(connection: IConnection, table: ITable): boolean {
    return (
      Object.values(this.arrowsCache).filter(arrow => {
        return (
          arrow.source.id === connection.source.id &&
          arrow.target.id === connection.target.id &&
          arrow.target.id === table.id
        );
      }).length > 0
    );
  }

  findCorrespondingTables(table: ITable): string[] {
    const source = table.area === 'source' ? 'target' : 'source';
    const rows = Object.values(this.arrowsCache)
      .filter(connection => connection[ table.area ].tableName === table.name)
      .map(arrow => arrow[ source ]);

    return uniqBy(rows, 'tableName').map(row => row.tableName);
  }

  findCorrespondingConnections(table: ITable, row: IRow): IConnection[] {
    return Object.values(this.arrowsCache).filter(connection => {
      return connection[ table.area ].tableName === table.name && connection[ table.area ].id === row.id;
    });
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

  findTable(name: string): ITable {
    const state = this.storeService.state;
    const index1 = state.target.findIndex(t => t.name === name);
    const index2 = state.source.findIndex(t => t.name === name);
    if (index1 > -1) {
      return state.target[ index1 ];
    } else if (index2 > -1) {
      return state.source[ index2 ];
    }

    return null;
  }
}
