import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CommonService } from 'src/app/services/common.service';
import { Connector } from 'src/app/models/connector';
import { IRow } from 'src/app/models/row';

import { parseArrowKey } from './business/rules';

@Injectable()
export class DrawService {
  get listIsEmpty(): boolean {
    return Object.keys(this.list).length === 0;
  }

  private svg: any;
  private list = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private commonService: CommonService
  ) {}

  drawLine(source: IRow, target: IRow): string {
    this.svg = this.document.querySelector('.canvas');

    const sourceRowId = source.id;
    const targetRowId = target.id;
    const sourceTableId = source.tableId;
    const targetTableId = target.tableId;

    const entityId = `${sourceTableId}-${sourceRowId}/${targetTableId}-${targetRowId}`;
    const drawEntity = new Connector(entityId, source, target);

    if (!this.list[entityId]) {
      this.list[entityId] = drawEntity;
      drawEntity.drawLine();

      // const button = this._appendButton(drawEntity);
      // drawEntity.button = button;
    }

    return entityId;
  }

  adjustArrowsPositions() {
    Object.keys(this.list).forEach(key => {
      const drawEntity: Connector = this.list[key];
      drawEntity.adjustPosition();
    });
  }

  removeConnector(id: string) {
    this.list[id].remove();
    delete this.list[id];

    if (this.listIsEmpty) {
      this.commonService.linked = false;
    }
  }

  removeAllConnectors() {
    Object.keys(this.list).forEach(key => this.removeConnector(key));
  }

  removeConnectorsBoundToTable({ id, area }) {
    Object.keys(this.list).forEach(key => {
      const { sourceTableId, targetTableId } = parseArrowKey(key);

      switch (area) {
        case 'source': {
          if (id === +sourceTableId) {
            this.removeConnector(key);
          }
          break;
        }
        case 'target': {
          if (id === +targetTableId) {
            this.removeConnector(key);
          }
          break;
        }
      }
    });
  }
}
