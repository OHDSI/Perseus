import {
  Injectable,
  Inject,
  Renderer2,
  RendererFactory2,
  RendererType2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CommonService } from 'src/app/services/common.service';
import { Connector } from 'src/app/models/Connector';
import { IRow } from 'src/app/models/row';

import { parseArrowKey } from './business/rules';
import { Arrow } from '../models/arrow';
import { Renderer } from 'ng2-qgrid/core/scene/render/render';

@Injectable()
export class DrawService {
  get listIsEmpty(): boolean {
    return Object.keys(this.list).length === 0;
  }

  private list = {};
  private renderer: Renderer2;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private commonService: CommonService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  drawLine(source: IRow, target: IRow): string {
    const canvas = this.commonService.canvas;

    const sourceRowId = source.id;
    const targetRowId = target.id;
    const sourceTableId = source.tableId;
    const targetTableId = target.tableId;

    const entityId = `${sourceTableId}-${sourceRowId}/${targetTableId}-${targetRowId}`;

    const drawEntity = new Arrow(
      canvas,
      entityId,
      source,
      target,
      this.renderer
    );

    // const drawEntity = new Connector(
    //   entityId,
    //   source,
    //   target,
    // );

    if (!this.list[entityId]) {
      this.list[entityId] = drawEntity;
      drawEntity.draw();

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
