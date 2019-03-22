import { Injectable, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DragService } from 'src/app/pages/mapping/services/drag.service';

@Injectable()
export class DrawService {
  private _source: any;
  private _target: any;
  private _svg: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dragService: DragService
  ) { 
      this._svg = document.querySelector('svg');
  }

  set source(row: any) {
    this._source = row;
  }
  get source() {
    return this._source;
  }

  set target(row: any) {
    this._target = row;
  }
  get target() {
    return this._target;
  }

  connectPoints() {
    const sourceSVGPoint = this.getSVGPoint(this.source, this.dragService.sourceTitle);
    this.drawPoint(sourceSVGPoint.x, sourceSVGPoint.y);

    const targetSVGPoint = this.getSVGPoint(this.target, this.dragService.targetTitle);
    this.drawPoint(targetSVGPoint.x, targetSVGPoint.y);

    this.drawLine(sourceSVGPoint.x, sourceSVGPoint.y, targetSVGPoint.x, targetSVGPoint.y);
  }

  getSVGPoint(element: HTMLElement, area: string) {
    const clientRect = element.getBoundingClientRect();
    const { height } = clientRect;
    
    let x: number;
    switch (area) {
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

  private drawPoint(x = '10', y = '100', radius = '0', color = 'blue') {
	  const shape = this.document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shape.setAttributeNS(null, "cx", x + '');
    shape.setAttributeNS(null, "cy", y + '');
    shape.setAttributeNS(null, "r",  radius + '');
    shape.setAttributeNS(null, "fill", color);
    this._svg.appendChild(shape);
  }

  private drawLine(x1, y1, x2, y2) {
    const line = this.document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1 + '');
    line.setAttribute('y1', y1 + '');
    line.setAttribute('x2', x2 + '');
    line.setAttribute('y2', y2 + '');
    line.setAttribute("stroke", "#066BBB");
    this._svg.appendChild(line);
  }
}
