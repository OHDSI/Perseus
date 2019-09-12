import { Injectable, Inject } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';
import { ArrowCache, Arrow } from '../models/arrow-cache';
import { MappingService } from '../models/mapping-service';
import { ITable } from '../models/table';
import { Subject } from 'rxjs';
import { uniqBy } from '../infrastructure/utility';
import { Configuration } from '../models/configuration';
import { StateService } from './state.service';
import { DrawTransformatorService } from './draw-transformator.service';

export interface IConnection {
  source: IRow;
  target: IRow;
}

@Injectable()
export class BridgeService {
  applyConfiguration$ = new Subject<Configuration>();
  resetAllMappings$ = new Subject<any>();

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

  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrowsCache: ArrowCache = {};
  connection = new Subject<IConnection>();

  deleteAll = new Subject();

  constructor(
    private commonService: CommonService,
    private drawService: DrawService,
    private stateService: StateService
  ) {}

  applyConfiguration(configuration: Configuration) {
    this.resetAllArrows();

    this.arrowsCache = Object.assign(configuration.arrows);

    this.applyConfiguration$.next(configuration);
  }

  connect() {
    const arrow = this.drawService.drawLine(this.sourceRow, this.targetRow);

    const connection: IConnection = {
      source: this.sourceRow,
      target: this.targetRow
    };

    this.arrowsCache[arrow.id] = connection;

    // ???
    this.commonService.linked = true;

    //
    this.connection.next(connection);
  }

  recalculateConnectorsPositions() {
    if (!this.drawService.listIsEmpty) {
      this.drawService.adjustArrowsPositions();
    }
  }

  // reset() {
  //   this.sourceRow = null;
  //   this.targetRow = null;
  // }

  getStyledAsDragStartElement() {
    this.sourceRow.htmlElement.classList.add('drag-start');
  }

  getStyledAsDragEndElement() {
    this.sourceRow.htmlElement.classList.remove('drag-start');
  }

  refreshAll() {
    this.drawService.removeAllConnectors();

    Object.values(this.arrowsCache).forEach((arrow: Arrow) => {
      const source = this.stateService.findTable(arrow.source.tableName);
      const target = this.stateService.findTable(arrow.source.tableName);
      if (source.expanded && target.expanded) {
        this.drawService.drawLine(arrow.source, arrow.target);
      }
    });
  }

  deleteArrow(key: string) {
    this.drawService.removeConnector(key);

    if (this.arrowsCache[key]) {
      delete this.arrowsCache[key];
    }
  }

  deleteTableArrows(table: ITable): void {
    this.drawService.removeConnectorsBoundToTable(table);
  }

  resetAllArrows() {
    this.drawService.removeAllConnectors();
    this.deleteAll.next();
    this.arrowsCache = {};
  }

  generateMapping() {
    const mappingService = new MappingService(this.arrowsCache);
    return mappingService.generate();
  }

  hasConnection(table: ITable): boolean {
    return (
      Object.values(this.arrowsCache).filter(connection => {
        return (
          connection.source.tableName === table.name ||
          connection.target.tableName === table.name
        );
      }).length > 0
    );
  }

  hasRowConnection(row: IRow): boolean {
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

  resetAllMappings() {
    this.resetAllArrows();

    this.resetAllMappings$.next();
  }
}
