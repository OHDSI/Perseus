import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IRow, Row } from 'src/app/models/row';
import { DrawService } from 'src/app/services/draw.service';
import { SqlFunction } from '../components/popups/rules-popup/transformation-input/model/sql-string-functions';
import { TransformationConfig } from '../components/vocabulary-transform-configurator/model/transformation-config';
import { Command } from '../infrastructure/command';
import { cloneDeep, uniq, uniqBy } from '../infrastructure/utility';
import { Arrow, ArrowCache, ConstantCache } from '../models/arrow-cache';
import { Configuration } from '../models/configuration';
import { IConnector } from '../models/interface/connector.interface';
import { MappingService } from '../models/mapping-service';
import { ITable } from '../models/table';
import { StoreService } from './store.service';
import { Area } from '../models/area';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import * as similarNamesMap from '../components/pages/mapping/similar-names-map.json';

export interface IConnection {
  source: IRow;
  target: IRow;
  connector: IConnector;
  transforms?: SqlFunction[];
  transformationConfigs?: TransformationConfig[];
  lookup?: {};
  type?: string;
  sql?: {};
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

  set draggedRowIndex(index: number) {
    this.draggedrowindex = index;
  }

  get draggedRowIndex() {
    return this.draggedrowindex;
  }

  set newRowIndex(index: number) {
    this.newrowindex = index;
  }

  get newRowIndex() {
    return this.newrowindex;
  }

  constructor(
    private drawService: DrawService,
    private storeService: StoreService
  ) { }

  applyConfiguration$ = new Subject<Configuration>();
  resetAllMappings$ = new Subject<any>();
  loadSavedSchema$ = new Subject<any>();
  saveAndLoadSchema$ = new Subject<any>();
  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;
  private draggedrowindex = null;
  private newrowindex = null;

  arrowsCache: ArrowCache = {};
  constantsCache: ConstantCache = {};
  connection = new Subject<IConnection>();
  removeConnection = new Subject<IConnection>();

  deleteAll = new Subject();

  similarNamesMap = (similarNamesMap as any).default;

  tables = {};

  connect = new Command({
    execute: (mappingConfig) => {
      this.tables = this.storeService.getMappedTables();
      const similar = 'similar';
      this.drawArrow(this.sourceRow, this.targetRow);
      const similarSourceRows = this.findSimilarRows(this.sourceRow.name, Area.Source);
      const similarTargetRows = this.findSimilarRows(this.targetRow.name, Area.Target);

      if (this.sourceRow.tableName === similar && this.targetRow.tableName !== similar) {
        similarSourceRows.forEach(row => {
          this.drawSimilar(mappingConfig, row, this.targetRow);
        });
      }

      if (this.targetRow.tableName === similar && this.sourceRow.tableName !== similar) {
        similarTargetRows.forEach(row => {
          this.drawSimilar(mappingConfig, this.sourceRow, row);
        });
      }

      if (this.sourceRow.tableName === similar && this.targetRow.tableName === similar) {
        similarSourceRows.forEach(sourceRow => {
          this.drawSimilar(mappingConfig, sourceRow, this.targetRow);
          similarTargetRows.forEach(targetRow => {
            this.drawSimilar(mappingConfig, sourceRow, targetRow);
          });
        });

        similarTargetRows.forEach(row => {
          this.drawSimilar(mappingConfig, this.sourceRow, row);
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

  getTables() {
    const { source, target, targetConfig } = this.storeService.state;

    let sourceTablesNames = [];
    const targetTablesNames = Object.keys(targetConfig).filter(key => {
      const data = targetConfig[ key ].data;
      if (data.length > 1) {
        sourceTablesNames.push(...data.slice(1, data.length));
        return true;
      }
      return false;
    });
    sourceTablesNames = uniq(sourceTablesNames);

    const tables = {
      source: source.filter(table => sourceTablesNames.includes(table.name)),
      target: target.filter(table => targetTablesNames.includes(table.name))
    }
    return tables;
  }

  drawSimilar(config, sourceRow, targetRow) {
    if (!this.canLink(config, sourceRow.tableName, targetRow.tableName)) {
      return;
    }
    this.drawArrow(sourceRow, targetRow);
  }

  canLink(config, sourceTableName, targetTableName) {
    for (const item of config) {
      if (item.includes(sourceTableName) && item.includes(targetTableName)) {
        return true;
      }
    }
    return false;
  }

  findSimilarRows(name, area) {
    const similarRows = [];
    this.tables[ area ].forEach(table => {
      table.rows.forEach(row => {
        if (this.checkSimilar(row.name, name)) {
          similarRows.push(new Row({ ...row }));
        }
      });
    });

    return similarRows;
  }

  checkSimilar(name1, name2) {
    return (
      name1 === name2 ||
      (this.similarNamesMap[ name1 ] === this.similarNamesMap[ name2 ]) &&
      (this.similarNamesMap[ name1 ] || this.similarNamesMap[ name2 ])
    );
  }

  findSimilarLinks(connection, area1, area2) {
    return Object.keys(this.arrowsCache).map(key => {
      const arrow = this.arrowsCache[ key ];
      if (
        this.checkSimilar(arrow[ area1 ].name, connection[ area1 ].name) &&
        this.checkSimilar(arrow[ area2 ].name, connection[ area2 ].name)) {
        return key;
      }
    });
  }

  updateRowsProperties(tables: any, filter: any, action: (row: any) => void) {
    tables.forEach(table => {
      table.rows.forEach(row => {
        if (filter(row)) {
          action(row);
        }
      });
    });
  }

  applyConfiguration(configuration: Configuration) {
    this.deleteAllArrows();

    this.arrowsCache = Object.assign(configuration.arrows);
    Object.keys(this.arrowsCache).forEach(arrowKey => this.arrowsCache[ arrowKey ].connector.selected = false);

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
    if (savedConnection) {
      if (!savedConnection.connector.selected && !force) {
        return;
      }

      this._deleteArrow(key, savedConnection);

      if (savedConnection.source.tableName === 'similar' || savedConnection.target.tableName === 'similar') {
        this.deleteSimilar(savedConnection);
      }
    }
  }

  deleteSimilar(connection) {
    const keys = this.findSimilarLinks(connection, Area.Source, Area.Target);

    keys.forEach(key => {
      const similarConnection = cloneDeep(this.arrowsCache[ key ]);
      this._deleteArrow(key, similarConnection);
    });
  }

  _deleteArrow(key, connection) {
    this.drawService.deleteConnector(key);

    if (this.arrowsCache[ key ]) {
      delete this.arrowsCache[ key ];
    }

    this.removeConnection.next(connection);
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
    this.copyTransformations(this.arrowsCache[ connector.id ]);

    this.connection.next(connection);
  }

  sourceConnectedToSameTarget(value: IConnection, draw: boolean) {
    return (item: IConnection) => {
      const tableName = value.connector.target.tableName.toUpperCase();
      if (tableName === 'SIMILAR' && !draw) {
        return item.connector.target.name.toUpperCase() === value.connector.target.name.toUpperCase();
      } else {
        return item.connector.target.name.toUpperCase() === value.connector.target.name.toUpperCase() &&
          item.connector.target.tableName.toUpperCase() === tableName;
      }
    }
  }

  copyTransformations(arrow: any) {
    const arrowWithSameTarget = Object.values(this.arrowsCache).filter(this.sourceConnectedToSameTarget(arrow, true))[ 0 ];
    if (arrowWithSameTarget.connector.id !== arrow.connector.id) {
      if (arrowWithSameTarget.lookup) { arrow.lookup = arrowWithSameTarget.lookup; }
      if (arrowWithSameTarget.sql) { arrow.sql = arrowWithSameTarget.sql; }
      const connectorType = arrowWithSameTarget.connector.type ? arrowWithSameTarget.connector.type : 'None';
      this.setArrowType(arrow.connector.id, connectorType);
    }
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

  generateMapping(sourceTableName: string = '') {
    const mappingService = new MappingService(
      this.arrowsCache,
      this.constantsCache,
      sourceTableName
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

  storeReorderedRows(tableName: string, area: string) {
    const index = this.storeService.state[ area ].findIndex(t => t.name === tableName);
    if (index > -1) {
      moveItemInArray(this.storeService.state[ area ][ index ].rows, this.draggedRowIndex, this.newrowindex);
      return;
    }
    return null;
  }

  updateConnectedRows(arrow: IConnection) {
    const connectedToSameTraget = Object.values(this.arrowsCache).
      filter(this.sourceConnectedToSameTarget(arrow, false));
    connectedToSameTraget.forEach(item => { item.lookup = { ...arrow.lookup }; item.sql = { ...arrow.sql }; });
    const applyedL = arrow.lookup ? arrow.lookup[ 'applied' ] ? true : false : false;
    const applyedT = arrow.sql ? arrow.sql[ 'applied' ] ? true : false : false;
    const appliedTransformations = applyedL && applyedT ? 'M' : applyedL || applyedT ? applyedL ? 'L' : 'T' : 'None';
    connectedToSameTraget.forEach(item => {
      this.setArrowType(item.connector.id, appliedTransformations);
    });
  }
}
