import { Injectable, Inject, EmbeddedViewRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DragService } from 'src/app/services/drag.service';
import { IRow } from '../components/pages/mapping/mapping.component';
import { BridgeButtonComponent } from '../components/bridge-button/bridge-button.component';
import { CommonService } from './common.service';

export class DrawEntity {
  constructor(public id, public source, public target){};
}

@Injectable()
export class DrawService {
  private _svg: any;
  private list = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dragService: DragService,
    private appRef: ApplicationRef,
    private injector: Injector,
    private commonService: CommonService
  ) { 
     
  }

  render() {
    this._removeAllLineNodes();
    this._removeAllButtons();
   
    for(let key in this.list) {
      const item = this.list[key];
      this._drawLine(item)
    }
  
  }

  drawLine(source, target) {
    this._svg = document.querySelector('.canvas');
    // const sourceSVGPoint = this._getSVGPoint(source, this.dragService.sourceTitle);
    // const targetSVGPoint = this._getSVGPoint(target, this.dragService.targetTitle);
    const sourceRowId = source.id;
    const targetRowId = target.id;
    const sourceTableId = source.tableId;
    const targetTableId = target.tableId;

    const entityId = sourceTableId + '-' + sourceRowId + '/' + targetTableId + '-' + targetRowId;
    const ent = new DrawEntity(entityId, source, target);
    //this.list[entityId] = ent;
   
    this._drawLine(ent);

    //this.render();
    
    
    //return this._drawLine(sourceSVGPoint.x, sourceSVGPoint.y, targetSVGPoint.x, targetSVGPoint.y);
  }

  private _getSVGPoint(row: IRow) {
    const clientRect = row.htmlElement.getBoundingClientRect();
    const { height } = clientRect;

    let x: number;
    switch (row.area) {
      case 'source': {
        x = clientRect.right;
        break;
      }
      case 'target': {
        x = clientRect.left;
        break;
      }
      default: {
        return null;
      }
    }

    const y = clientRect.bottom - height / 2;
    const pt = this._svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const svgPoint = pt.matrixTransform(this._svg.getScreenCTM().inverse());

    return svgPoint;
  }

  private _drawLine(ent) {
    const sourceSVGPoint = this._getSVGPoint(ent.source);
    const targetSVGPoint = this._getSVGPoint(ent.target);

    const id = ent.id;

    const {x: x1, y: y1} = sourceSVGPoint;
    const {x: x2, y: y2} = targetSVGPoint;
    const line = this.document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1 + '');
    line.setAttribute('y1', y1 + '');
    line.setAttribute('x2', (x2 - 6) + '');
    line.setAttribute('y2', y2 + '');
    line.setAttribute('id', id);
    line.setAttribute('marker-end', 'url(#arrow)');

    this._svg.appendChild(line);
    if(!this.list[id]) {
      this.list[id] = ent;
    }

    this._appendButton(line);
  }

  private _removeAllLineNodes() {
    const lngth = this._svg.childNodes.length - 1;
    for(let i = 0; i < lngth; i++) {
      const line = this._svg.childNodes[1];
      line.remove()
    }
  }

  private _removeAllButtons() {
    const canvas = this.document.querySelector('.main');
    const lngth = canvas.childNodes.length - 1;
    Array.prototype.slice.call(canvas.childNodes)
    .filter(n => n.nodeName === 'APP-BRIDGE-BUTTON')
    .map(n => n.remove());
    
  }

  private _appendButton(line) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(BridgeButtonComponent)
      .create(this.injector);

    this.appRef.attachView(componentRef.hostView);

    const button = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    const canvas = this.document.querySelector('.main');
    canvas.appendChild(button);

    const {top, left} = this._calculateButtonPosition(button, canvas, line);

    button.style.top = top + 'px';
    button.style.left = left + 'px';
  }
  
  private _calculateButtonPosition(button, canvas, line) {
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
