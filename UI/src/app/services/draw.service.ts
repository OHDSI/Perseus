import {
  Injectable,
  Inject,
  EmbeddedViewRef,
  ApplicationRef,
  Injector,
  ComponentFactoryResolver
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BridgeButtonComponent } from 'src/app/components/bridge-button/bridge-button.component';
import { CommonService } from 'src/app/services/common.service';
import { Connector } from 'src/app/models/connector';
import { IRow } from 'src/app/models/row';

import { middleHeightOfLine, areaOffset } from './utilites/draw-utilites';
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
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
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

      const button = this._appendButton(drawEntity);
      drawEntity.button = button;
    }

    return entityId;
  }

  fixConnectorsPosition() {
    Object.keys(this.list)
      .forEach(key => {
        const drawEntity = this.list[key];
        drawEntity.fixPosition();
        this._recalculateButtonPosition(drawEntity.button, drawEntity.line);
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
    Object.keys(this.list)
      .forEach(key => this.removeConnector(key));
  }

  removeConnectorsBoundToTable({id, area}) {
    Object.keys(this.list).forEach(key => {
      const {ids, sourceTableRowIds, targetTableRowIds, sourceTableId, targetTableId } = parseArrowKey(key);

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

  // TODO Move
  private _appendButton(drawEntity: Connector) {
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

    const { top, left } = this._calculateButtonPosition(button, line);

    button.style.top = top + 'px';
    button.style.left = left + 'px';

    return button;
  }

  // TODO Move
  private _recalculateButtonPosition(button, line) {
    const { top, left } = this._calculateButtonPosition(button, line);

    button.style.top = top + 'px';
    button.style.left = left + 'px';
  }

  // TODO Move
  private _calculateButtonPosition(button, line) {
    const canvas = this.document.querySelector('.main');
    const buttonClientRect = button.getBoundingClientRect();
    const buttonOffsetX = buttonClientRect.width / 2;
    const buttonOffsetY = buttonClientRect.height / 2;

    return {
      top: middleHeightOfLine(line) - buttonOffsetY,
      left:
        canvas.clientWidth / 2 - buttonOffsetX - areaOffset(this.commonService)
    };
  }
}
