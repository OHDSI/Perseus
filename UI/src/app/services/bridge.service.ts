import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IRow, Row } from 'src/app/models/row';
import { DrawService } from 'src/app/services/draw.service';
import { SqlFunction } from '../popups/rules-popup/transformation-input/model/sql-string-functions';
import { TransformationConfig } from '../mapping/vocabulary-transform-configurator/model/transformation-config';
import { Command } from '../infrastructure/command';
import { cloneDeep, uniq, uniqBy } from '../infrastructure/utility';
import { Arrow, ArrowCache, ConstantCache } from '../models/arrow-cache';
import { Configuration } from '../models/configuration';
import { IConnector } from '../models/interface/connector.interface';
import { addClonesToMapping, addGroupMappings, addViewsToMapping, MappingService } from '../models/mapping-service';
import { ITable, Table } from '../models/table';
import { StoreService } from './store.service';
import { Area } from '../models/area';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import * as similarNamesMap from '../mapping/similar-names-map.json';
import { conceptFieldsTypes, similarTableName } from '../app.constants';
import * as conceptFields from '../mapping/concept-fileds-list.json';
import { ConceptTransformationService } from './concept-transformation.sevice';
import { getConceptFieldNameByType } from 'src/app/services/utilites/concept-util';

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

@Injectable({
  providedIn: 'root'
})
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

  set draggedRowY(y: number) {
    this.draggedrowy = y;
  }

  get draggedRowY() {
    return this.draggedrowy;
  }

  set draggedRowClass(cls: string) {
    this.draggedrowclass = cls;
  }

  get draggedRowClass() {
    return this.draggedrowclass;
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
  saveAndLoadSchema$ = new Subject<any>();
  reportLoading$ = new Subject<boolean>();
  conceptSqlTransfomed$ = new Subject<string>();
  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;
  private draggedrowindex = null;
  private newrowindex = null;
  private draggedrowy = null;
  private draggedrowclass = null;

  arrowsCache: ArrowCache = {};
  constantsCache: ConstantCache = {};
  connection = new Subject<IConnection>();
  removeConnection = new Subject<IConnection>();

  deleteAll = new Subject();

  similarNamesMap = (similarNamesMap as any).default;
  similarTableName = similarTableName;

  tables = {};

  conceptFieldNames = (conceptFields as any).default;

  connect = new Command({
    execute: (mappingConfig) => {
      this.tables = this.storeService.getMappedTables();
      const similar = 'similar';
      const arrow = this.drawArrow(this.sourceRow, this.targetRow);
      const similarSourceRows = this.findSimilarRows(this.tables, this.sourceRow.name, Area.Source);
      const similarTargetRows = this.findSimilarRows(this.tables, this.targetRow.name, Area.Target);

      if (this.sourceRow.tableName === similar && this.targetRow.tableName !== similar) {
        similarSourceRows.forEach(row => {
          this.drawSimilar(mappingConfig, row, this.targetRow);
        });
        this.drawSimilarCloneLinks(arrow, similarSourceRows);
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

  dropConstant = new Command({
    execute: (row: IRow) => {
      delete this.constantsCache[ this.getConstantId(row) ];
    },
    canExecute: () => true
  });

  getDefaultClones(targetTableName: string) {
    const cloneTables = this.storeService.state.targetClones[ targetTableName ];
    if (cloneTables) {
      return cloneTables.filter(item => item.cloneName === 'Default');
    }
  }

  drawSimilarCloneLinks(arrow: any, similarSourceRows: any) {
    const defaultTables = this.getDefaultClones(this.targetRow.tableName);
    if (defaultTables) {
      defaultTables.forEach(item => {
        const targetcloneRow = item.rows.find(it => it.name === this.targetRow.name);
        const similarSourceRow = similarSourceRows.filter(it => it.tableName === targetcloneRow.cloneConnectedToSourceName);
        if (similarSourceRow.length) {
          this.drawArrow(similarSourceRow[ 0 ], targetcloneRow, arrow.type);
        }
      });
    }
  }

  updateSimilarConcepts(row: any) {
    const tablesWithSimilarLinks = uniq(Object.values(this.arrowsCache).
      filter(this.sourceConnectedToSameTarget(row, false)).map(item => item.source.tableName))
      .filter(item => item !== 'similar');

    let defaultClonesConnectedToNames = [];
    const defaultClonesConnectedTo = this.getDefaultClones(row.tableName);
    if (defaultClonesConnectedTo) {
      defaultClonesConnectedToNames = defaultClonesConnectedTo.map(it => it.cloneConnectedToSourceName);
    }
    const conceptFields = this.conceptFieldNames[ row.tableName ];
    const conceptFieldsDictionary = this.getConceptFieldsDictionary(conceptFields);

    tablesWithSimilarLinks.forEach(item => {
      const conceptsCopy = cloneDeep(this.storeService.state.concepts[ `${row.tableName}|similar` ]);
      let linksToConceptFields = Object.values(this.arrowsCache)
        .filter(it => it.source.tableName === item && it.target.tableName === row.tableName && conceptFields.includes(it.target.name));

      if (!defaultClonesConnectedToNames.includes(item)) {
        this.removeDeletedLinksFromFields(conceptsCopy, linksToConceptFields, conceptFieldsDictionary);
        this.storeService.state.concepts[ `${row.tableName}|${item}` ] = conceptsCopy;
        this.updateConceptArrowTypes(row.tableName, item, row.cloneTableName);
      } else {
        linksToConceptFields = linksToConceptFields.filter(it => it.target.cloneTableName === 'Default');
        this.removeDeletedLinksFromFields(conceptsCopy, linksToConceptFields, conceptFieldsDictionary);
        const concepts = this.storeService.state.concepts[ `${row.tableName}|${item}` ];
        concepts.conceptsList = concepts.conceptsList.filter(it => it.fields[ 'concept_id' ].targetCloneName !== 'Default');

        conceptsCopy.conceptsList.forEach(it => {
          Object.values(it.fields).forEach(field => {
            (field as any).targetCloneName = 'Default';
          })
        })

        concepts.conceptsList = concepts.conceptsList.concat(conceptsCopy.conceptsList)
        concepts.conceptsList.forEach((it, index) => {
          it.id = index;
        })
        concepts.lookup = conceptsCopy.lookup;
        this.updateConceptArrowTypes(row.tableName, item, 'Default');
      }
    })
  }

  removeDeletedLinksFromFields(conceptsCopy: any, linksToConceptFields: any, conceptFieldsDictionary: any) {
    conceptsCopy.conceptsList.forEach(conc => {
      Object.keys(conc.fields).forEach(type => {
        const sourceField = conc.fields[ type ].field;
        const linkExists = linksToConceptFields.filter(it => it.target.name === conceptFieldsDictionary[ type ] && it.source.name === sourceField);
        if (sourceField && !linkExists.length) {
          conc.fields[ type ].field = '';
        }
      })
    })
  }

  getConceptFieldsDictionary(conceptFields: any) {
    const conceptFieldsDictionary = {};
    conceptFieldsTypes.forEach(it => {
      conceptFieldsDictionary[ it ] = getConceptFieldNameByType(it, conceptFields);
    })
    return conceptFieldsDictionary;
  }

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

    return {
      source: source.filter(table => sourceTablesNames.includes(table.name)),
      target: target.filter(table => targetTablesNames.includes(table.name))
    };
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

  findSimilarRows(tables, name, area?) {
    const similarRows = [];
    const tablesToSearch = area ? tables[ area ] : tables;
    tablesToSearch.forEach(table => {
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

    this.constantsCache = Object.assign(configuration.constantsCache);
    this.arrowsCache = Object.assign(configuration.arrows);

    Object.keys(this.arrowsCache)
      .forEach(arrowKey => this.arrowsCache[ arrowKey ].connector.selected = false);

    const isMappingNotEmpty = Object.keys(configuration.arrows).length > 0;

    this.storeService.state = {
      ...this.storeService.state,
      filtered: configuration.filtered,
      version: configuration.cdmVersion,
      target: configuration.targetTables,
      source: configuration.sourceTables,
      targetConfig: configuration.tables,
      report: configuration.reportName,
      targetClones: configuration.targetClones,
      mappingEmpty: !isMappingNotEmpty,
      sourceSimilar: configuration.sourceSimilarRows,
      targetSimilar: configuration.targetSimilarRows,
      recalculateSimilar: configuration.recalculateSimilarTables,
      concepts: configuration.tableConcepts
    };

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
    this.deleteConceptFields(connection)

    this.removeConnection.next(connection);
  }

  deleteConceptFields(connection) {
    if (connection) {
      if (this.conceptFieldNames[ connection.target.tableName ] && this.conceptFieldNames[ connection.target.tableName ].includes(connection.target.name)) {
        const conceptService = new ConceptTransformationService(connection.target.tableName, connection.source.tableName,
          this.storeService.state.concepts, connection, connection.target.cloneTableName, connection.target.condition, this.arrowsCache);
        conceptService.deleteFieldsFromConcepts();
        this.updateConceptArrowTypes(connection.target.tableName, connection.source.tableName, connection.target.cloneTableName, )
      }
    }
  }

  updateConceptArrowTypes(targetTable: string, sourceTable: string, cloneName: string) {
    const concepts = this.storeService.state.concepts[ `${targetTable}|${sourceTable}` ].conceptsList
      .filter(item => item.fields[ 'concept_id' ].targetCloneName === cloneName);

    const arrows = Object.values(this.arrowsCache).filter(item => item.source.tableName === sourceTable &&
      item.target.tableName === targetTable && item.target.cloneTableName === cloneName);

    if (!concepts.length) {
      arrows.forEach(item => this.setArrowType(item.connector.id, 'None'));
    } else {
      arrows.forEach(item => this.setArrowType(item.connector.id, 'concept'));
    }
  }

  deleteArrowsForMapping(targetTableName: string, sourceTableName: string, tableCloneName?: string) {
    const deleteCondition = tableCloneName ?
      (targetName: any, sourceName: any, cloneName: any) => targetName.toUpperCase() === targetTableName.toUpperCase() &&
        sourceName.toUpperCase() === sourceTableName.toUpperCase() &&
        tableCloneName.toUpperCase() === cloneName.toUpperCase() :
      (targetName: any, sourceName: any, cloneName: any) => targetName.toUpperCase() === targetTableName.toUpperCase() &&
        sourceName.toUpperCase() === sourceTableName.toUpperCase();
    Object.keys(this.arrowsCache).forEach(key => {
      const cache = this.arrowsCache[ key ];
      const { target: { tableName: cachedTargetTableName, cloneTableName: clone }, source: { tableName: cachedSourceTableName } } = cache;
      if (deleteCondition(cachedTargetTableName, cachedSourceTableName, clone)) {
        this.deleteConceptFields(this.arrowsCache[ key ]);
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

  drawArrow(sourceRow, targetRow, type = '', cloneTable?) {
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
    this.copyTransformations(this.arrowsCache[ connector.id ], cloneTable);
    if (!cloneTable) {
      this.updateConcepts(connection);
    }

    this.connection.next(connection);

    return connection;
  }

  updateConcepts(connection: any) {
    if (this.conceptFieldNames[ connection.target.tableName ] && this.conceptFieldNames[ connection.target.tableName ].includes(connection.target.name)) {
      const conceptService = new ConceptTransformationService(connection.target.tableName, connection.source.tableName,
        this.storeService.state.concepts, connection, connection.target.cloneTableName, connection.target.condition, this.arrowsCache);
      conceptService.addFieldToConcepts();
      this.setArrowType(connection.connector.id, 'concept');
    }
  }

  sourceConnectedToSameTarget(row: IRow, draw: boolean) {
    return (item: IConnection) => {
      const tableName = row.tableName.toUpperCase();
      return item.connector.target.name.toUpperCase() === row.name.toUpperCase() &&
        item.connector.target.tableName.toUpperCase() === tableName &&
        item.connector.target.cloneTableName === row.cloneTableName;
    };
  }

  sourceConnectedToSameTargetByName(rowName: string, row: any, sourceTable: string) {
    return (item: IConnection) => {
      return item.connector.target.name.toUpperCase() === rowName.toUpperCase() &&
        item.connector.target.tableName.toUpperCase() === row.tableName.toUpperCase() &&
        item.connector.target.cloneTableName === row.cloneTableName &&
        item.connector.source.tableName.toUpperCase() === sourceTable.toUpperCase();
    };
  }

  copyTransformations(arrow: any, cloneTable?: any) {
    const arrowWithSameTarget = cloneTable ? Object.values(this.arrowsCache).
      filter(item => item.target.tableName === cloneTable.name &&
        item.target.cloneTableName === cloneTable.cloneName && item.target.name === arrow.target.name)[ 0 ] :
      Object.values(this.arrowsCache).filter(this.sourceConnectedToSameTarget(arrow.connector.target, true))[ 0 ];

    if (arrowWithSameTarget.connector.id !== arrow.connector.id) {
      if (arrowWithSameTarget.lookup) { arrow.lookup = arrowWithSameTarget.lookup; }
      if (arrowWithSameTarget.sql) { arrow.sql = arrowWithSameTarget.sql; }
      const connectorType = arrowWithSameTarget.connector.type ? arrowWithSameTarget.connector.type : 'None';
      this.setArrowType(arrow.connector.id, connectorType);
    }
  }

  drawCloneArrows(cloneTable: ITable, targetTable: ITable, sourceTableName: string) {
    const arrowConnectedToTarget = Object.values(this.arrowsCache).filter(it => it.target.tableName === targetTable.name &&
      it.target.cloneTableName === targetTable.cloneName && it.source.tableName === sourceTableName);
    arrowConnectedToTarget.forEach(item => {
      const sourceRow = item.source;
      const targetRow = cloneTable.rows.find(it => it.name === item.target.name);
      this.drawArrow(sourceRow, targetRow, item.type, targetTable);
    });
  }

  addCloneConstants(cloneTable: ITable, targetTable: ITable, sourceTableName: string) {
    const constants = Object.values(this.constantsCache).filter(it => it.tableName === targetTable.name &&
      it.cloneTableName === targetTable.cloneName);
    constants.forEach(item => {
      const row = cloneTable.rows.find(el => el.name === item.name);
      this.constantsCache[ this.getConstantId(row) ] = row;
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
      this.deleteArrow(arrow.connector.id, true);
    });

    this.deleteAll.next();
  }

  deleteAllConstants() {
    this.constantsCache = {};
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

  generateMapping(sourceTableName: string = '', targetTableName: string = '') {
    const mappingService = new MappingService(
      this.arrowsCache,
      this.constantsCache,
      sourceTableName,
      targetTableName,
      this.storeService.state.concepts,
      this.storeService.state.targetClones
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
          connection[ area ].tableName === row.tableName &&
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
    this.deleteAllConstants();

    this.resetAllMappings$.next();
  }

  reportLoading() {
    this.reportLoading$.next(true);
  }

  reportLoaded() {
    this.reportLoading$.next(false);
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
    let connectedToSameTraget = Object.values(this.arrowsCache).
      filter(this.sourceConnectedToSameTarget(arrow.connector.target, false));
    if (arrow.connector.target.tableName.toUpperCase() === 'SIMILAR') {
      let similarLinks = [];
      connectedToSameTraget.forEach(item => {
        similarLinks = similarLinks.concat(this.findSimilarLinks(item.connector, Area.Source, Area.Target)).
          filter(e => e !== undefined);
      });
      connectedToSameTraget = [];
      similarLinks.forEach(item => connectedToSameTraget = connectedToSameTraget.concat(this.arrowsCache[ item ]));
    }
    connectedToSameTraget.forEach(item => { item.lookup = { ...arrow.lookup }; item.sql = { ...arrow.sql }; });
    const applyedL = arrow.lookup ? !!arrow.lookup[ 'applied' ] : false;
    const applyedT = arrow.sql ? !!arrow.sql[ 'applied' ] : false;
    const appliedTransformations = applyedL && applyedT ? 'M' : applyedL || applyedT ? applyedL ? 'L' : 'T' : 'None';
    connectedToSameTraget.forEach(item => {
      this.setArrowType(item.connector.id, appliedTransformations);
    });
  }

  saveChangesInGroup(groupTableName: string, rows: IRow[]) {
    this.storeService.state.source.find(item => item.name === groupTableName).rows = rows;
  }

  generateMappingWithViewsAndGroups(sourceTables: any) {
    const mappingJSON = this.generateMapping();

    if (!sourceTables.length) {
      const { source, target } = this.storeService.getMappedTables();
      sourceTables = source;
    }

    sourceTables.forEach(source => {
      addViewsToMapping(mappingJSON, source);
    });

    sourceTables.forEach(source => {
      addGroupMappings(mappingJSON, source);
    });

    return mappingJSON;
  }

  generateMappingWithViewsAndGroupsAndClones(sourceTables: any) {
    const mappingJSON = this.generateMappingWithViewsAndGroups(sourceTables);

    return addClonesToMapping(mappingJSON);
  }

  prepareTables(data, area, areaRows) {
    const similarRows = [];

    const tables = data.map(table => {
      this.collectSimilarRows(table.rows, area, areaRows, similarRows);
      return new Table(table);
    });

    if (similarRows.length) {
      const similarSourceTable = new Table({
        id: this.storeService.state[ area ].length,
        area,
        name: this.similarTableName,
        rows: similarRows
      });
      tables.push(similarSourceTable);
    }

    return tables;
  }

  collectSimilarRows(rows, area, areaRows, similarRows) {
    rows.forEach(row => {
      if (!row.grouppedFields || !row.grouppedFields.length) {

        if (!this.checkIncludesRows(areaRows, row)) {
          areaRows.push(row);
          return;
        }

        if (!this.checkIncludesRows(similarRows, row)) {
          const rowName = this.similarNamesMap[ row.name ] ? this.similarNamesMap[ row.name ] : row.name;
          const rowForSimilar = {
            ...row,
            name: rowName,
            id: similarRows.length,
            tableName: this.similarTableName,
            tableId: this.storeService.state[ area ].length
          };
          similarRows.push(rowForSimilar);
        }

      }
    });
  }

  checkIncludesRows(rows, row) {
    return !!rows.find(r => {
      return (
        r.name === row.name ||
        (this.similarNamesMap[ r.name ] === this.similarNamesMap[ row.name ]) &&
        (this.similarNamesMap[ r.name ] || this.similarNamesMap[ row.name ])
      );
    });
  }

  changeConceptSql(sql: string) {
    this.conceptSqlTransfomed$.next(sql);
  }
}
