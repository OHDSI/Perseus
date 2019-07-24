import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';
import { ITable } from '../models/table';
import { ArrowCache, Arrow } from '../models/arrow-cache';
import { MappingService } from '../models/mapping-service';

@Injectable()
export class BridgeService {
  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrowsCache: ArrowCache = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
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

  connect() {
    const arrowId = this.drawService.drawLine(this.sourceRow, this.targetRow);
    this.arrowsCache[arrowId] = {
      source: this.sourceRow,
      target: this.targetRow
    };
    this.commonService.linked = true;
  }

  invalidate() {
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

    // For what?
    // if (!this.drawService.listIsEmpty) {
    //   this.drawService.fixConnectorsPosition();
    // }
  }

  refresh(table: ITable): void {
    if (table.area === 'source' || table.area === 'target') {
      Object.values(this.arrowsCache)
        .filter(arrow => arrow[table.area].tableId === table.id)
        .map((arrow: Arrow) => {
          this.drawService.drawLine(arrow.source, arrow.target);
        });
    } else {
      throw new Error('table area should be "source" or" "target"');
    }
  }

  deleteArrow(key: string) {
    this.drawService.removeConnector(key);

    if (this.arrowsCache[key]) {
      delete this.arrowsCache[key];
    }
  }

  hideArrows({ id, area }) {
    this.drawService.removeConnectorsBoundToTable({ id, area });
  }

  generateMapping() {
    const mappingService = new MappingService(this.arrowsCache);
    return mappingService.generate();
  }
}
