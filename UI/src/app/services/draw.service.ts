import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { IRow } from 'src/app/models/row';
import { CommonService } from 'src/app/services/common.service';
import { Arrow } from '../models/arrow';
import { IConnector } from '../models/interface/connector.interface';
import { parseArrowKey } from './business/rules';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  get list(): { [key: string]: IConnector } {
    return Object.assign({}, this.cache);
  }

  private cache: { [key: string]: IConnector } = {};

  get listIsEmpty(): boolean {
    return Object.keys(this.cache).length === 0;
  }

  private readonly renderer: Renderer2;

  constructor(
    private commonService: CommonService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  drawLine(entityId: string, source: IRow, target: IRow, type: any): IConnector {
    const canvas = this.commonService.svgCanvas;

    const drawEntity = new Arrow(
      canvas,
      entityId,
      source,
      target,
      type,
      this.renderer
    );

    if (!this.cache[entityId]) {
      this.cache[entityId] = drawEntity;
      drawEntity.draw();
    }

    return this.cache[entityId];
  }

  deleteAllConnectors() {
    Object.keys(this.cache).forEach(key => {
      this.deleteConnector(key);
    });
  }

  deleteConnector(key) {
    if (this.cache[key]) {
      this.cache[key].remove();
      delete this.cache[key];
    }
  }

  deleteConnectorsBoundToTable({id, area}) {
    Object.keys(this.cache).forEach(key => {
      const {sourceTableId, targetTableId} = parseArrowKey(key);

      switch (area) {
        case 'source': {
          if (id === +sourceTableId) {
            this.deleteConnector(key);
          }
          break;
        }
        case 'target': {
          if (id === +targetTableId) {
            this.deleteConnector(key);
          }
          break;
        }
      }
    });
  }
}
