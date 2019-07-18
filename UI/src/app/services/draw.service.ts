import { Injectable, Inject, EmbeddedViewRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BridgeButtonComponent } from 'src/app/components/bridge-button/bridge-button.component';
import { CommonService } from 'src/app/services/common.service';
import { Connector } from 'src/app/models/connector';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';

@Injectable()
export class DrawService {
  private _svg: any;
  list = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private commonService: CommonService
  ) { }

  drawLine(source: IRow, target: IRow) {
    this._svg = this.document.querySelector('.canvas');
    const sourceRowId = source.id;
    const targetRowId = target.id;
    const sourceTableId = source.tableId;
    const targetTableId = target.tableId;

    const entityId = sourceTableId + '-' + sourceRowId + '/' + targetTableId + '-' + targetRowId;
    const drawEntity = new Connector(entityId, source, target);

    if (!this.list[entityId]) {
      this.list[entityId] = drawEntity;
      drawEntity.drawLine();

      const button = this._appendButton(drawEntity);
      drawEntity.button = button;
    }
  }

  fixConnectorsPosition() {
    for (let key in this.list) {
      const drawEntity = this.list[key];
      drawEntity.fixPosition();

      this._recalculateButtonPosition(drawEntity.button, drawEntity.line);
    }
  }

  removeConnector(id: string) {
    this.list[id].remove();
    delete this.list[id];

    if (this.listIsEmpty()) {
      this.commonService.linked = false;
    }
  }

  removeAllConnectors() {
    for (const key in this.list) {
      if (key) {
        this.removeConnector(key);
      }
    }
  }

  removeConnectorsBoundToTable(table: ITable) {
    const { area } = table;
// tslint:disable-next-line: forin
    for (const key in this.list) {
      const ids = key.split('/');
      const sourceTableRowIds = ids[0];
      const targetTableRowIds = ids[1];
      const sourceTableId = sourceTableRowIds.split('-')[0];
      const targetTableId = targetTableRowIds.split('-')[0];

      switch (area) {
        case 'source': {
          if (table.id === +sourceTableId) {
            this.removeConnector(key);
          }
          break;
        }
        case 'target': {
          if (table.id === +targetTableId) {
            this.removeConnector(key);
          }
          break;
        }
      }
    }
  }

  listIsEmpty() {
    return Object.keys(this.list).length === 0;
  }

  private _appendButton(drawEntity) {
    const line = drawEntity.line;
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(BridgeButtonComponent)
      .create(this.injector);
    componentRef.instance.drawEntity = drawEntity;

    this.appRef.attachView(componentRef.hostView);

    const button = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    const canvas = this.document.querySelector('.main');
    canvas.appendChild(button);

    const {top, left} = this._calculateButtonPosition(button, line);

    button.style.top = top + 'px';
    button.style.left = left + 'px';

    return button;
  }

  private _recalculateButtonPosition(button, line) {
    const {top, left} = this._calculateButtonPosition(button, line);

    button.style.top = top + 'px';
    button.style.left = left + 'px';
  }

  private _calculateButtonPosition(button, line) {
    const canvas = this.document.querySelector('.main');
    const buttonClientRect = button.getBoundingClientRect();
    const buttonOffsetX = buttonClientRect.width / 2;
    const buttonOffsetY = buttonClientRect.height / 2;

    const middleHeightOfLine = this._middleHeightOfLine(line);

    return {
      top: middleHeightOfLine - buttonOffsetY,
      left: (canvas.clientWidth / 2) - buttonOffsetX - this._areaOffset()
    };
  }

  private _middleHeightOfLine(line) {
    const {y1, y2} = line.attributes;

    return ( +y1.nodeValue + +y2.nodeValue) / 2;
  }

  private _areaOffset() {
    const {sourceAreaWidth: source, targetAreaWidth: target} = this.commonService;
    const offset = (Math.max(source, target) - Math.min(source, target)) / 2;
    return source > target ? -offset : offset;
  }
}
