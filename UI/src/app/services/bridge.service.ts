import { Injectable, Inject } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';
import { ArrowCache, Arrow } from '../models/arrow-cache';
import { MappingService } from '../models/mapping-service';
import { ITable } from '../models/table';
import { Subject } from 'rxjs';

@Injectable()
export class BridgeService {
  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrowsCache: ArrowCache = {};

  connection = new Subject();

  constructor(
    private commonService: CommonService,
    private drawService: DrawService
  ) {}

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

  //private sourceRow: IRow;
  //private targetRow: IRow;

  connect() {
    const arrowId = this.drawService.drawLine(this.sourceRow, this.targetRow);
    this.arrowsCache[arrowId] = {
      source: this.sourceRow,
      target: this.targetRow
    };

    // ???
    this.commonService.linked = true;

    //
    this.connection.next();
  }

  reset() {
    this.sourceRow = null;
    this.targetRow = null;
  }

  getStyledAsDragStartElement() {
    this.sourceRow.htmlElement.classList.add('drag-start');
  }
  getStyledAsDragEndElement() {
    this.sourceRow.htmlElement.classList.remove('drag-start');
  }

  refreshAll() {
    this.drawService.removeAllConnectors();

    Object.values(this.arrowsCache).forEach((arrow: Arrow) => {
      this.drawService.drawLine(arrow.source, arrow.target);
    });
  }

  deleteArrow(key: string) {
    this.drawService.removeConnector(key);

    if (this.arrowsCache[key]) {
      delete this.arrowsCache[key];
    }
  }

  generateMapping() {
    const mappingService = new MappingService(this.arrowsCache);
    return mappingService.generate();
  }

  hasConnection(table: ITable): boolean {
    return Object.values(this.arrowsCache).filter(connection => {
      return connection.source.tableName == table.name ||
      connection.target.tableName === table.name
    }).length > 0;
  }
}
