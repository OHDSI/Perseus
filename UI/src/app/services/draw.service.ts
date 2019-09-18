import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { IRow } from 'src/app/models/row';

import { parseArrowKey } from './business/rules';
import { Arrow } from '../models/arrow';
import { IConnector } from '../models/interface/connector.interface';
import { DrawTransformatorService } from './draw-transformator.service';
import { UserSettings } from './user-settings.service';

@Injectable()
export class DrawService {
  get listIsEmpty(): boolean {
    return Object.keys(this.list).length === 0;
  }

  private list = {};
  private renderer: Renderer2;
  constructor(
    private commonService: CommonService,
    private drawTransform: DrawTransformatorService,
    private userSettings: UserSettings,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  drawLine(source: IRow, target: IRow): IConnector {
    const canvas = this.commonService.svgCanvas;

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

    if (!this.list[entityId]) {
      this.list[entityId] = drawEntity;
      drawEntity.draw();
    }

    if (this.userSettings.showQuestionButtons) {
      this.drawTransform.createButton(drawEntity);
    }

    return drawEntity;
  }

  adjustArrowsPositions() {
    Object.keys(this.list).forEach(key => {
      const drawEntity: Arrow = this.list[key];
      drawEntity.adjustPosition();

      if (this.userSettings.showQuestionButtons) {
        this.drawTransform.recalculateButtonPosition(
          drawEntity.button,
          drawEntity.line
        );
      }
    });
  }

  removeConnector(id: string, removeSelected: boolean = false) {
    if (removeSelected && !this.list[id].selected) {
      return;
    }

    this.list[id].remove();
    delete this.list[id];
  }

  removeConnectors() {
    Object.keys(this.list).forEach(key => this.removeConnector(key));
  }

  removeSelectedConnectors() {
    Object.keys(this.list).forEach(key => this.removeConnector(key, true));
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
