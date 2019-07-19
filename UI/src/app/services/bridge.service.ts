import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';

@Injectable()
export class BridgeService {
  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrowsCache = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private commonService: CommonService,
    private drawService: DrawService
  ) {

  }

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
    this.arrowsCache[arrowId] = {source: this.sourceRow, destination: this.targetRow};
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

  refresh(): void {
    this.drawService.removeAllConnectors();

    Object.values(this.arrowsCache).forEach((arrow: any) => {
      this.drawService.drawLine(arrow.source, arrow.destination);
    });

    // For what?
    if (!this.drawService.listIsEmpty) {
      this.drawService.fixConnectorsPosition();
    }
  }

  deleteArrow(key: string) {
    this.drawService.removeConnector(key);

    if (this.arrowsCache[key]) {
      delete this.arrowsCache[key];
    }
  }

  hideArrows({id, area}) {
    this.drawService.removeConnectorsBoundToTable({id, area});
  }
}
