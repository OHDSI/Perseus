import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';
import { generateString } from '../infrastructure/utility';

@Injectable()
export class BridgeService {
  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrows = {};

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
    this.arrows[generateString(10)] = {source: this.sourceRow, destination: this.targetRow};

    this.drawService.drawLine(this.sourceRow, this.targetRow);
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

    Object.values(this.arrows).forEach((arrow: any) => {
      this.drawService.drawLine(arrow.source, arrow.destination);
    });
  }
}
