import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DragService } from 'src/app/services/drag.service';

@Injectable()
export class DrawService {
  private _svg: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dragService: DragService,
  ) { 
      this._svg = document.querySelector('.canvas');
  }

  drawLine(source, target) {
    const sourceSVGPoint = this._getSVGPoint(source, this.dragService.sourceTitle);
    this._drawPoint(sourceSVGPoint.x, sourceSVGPoint.y);

    const targetSVGPoint = this._getSVGPoint(target, this.dragService.targetTitle);
    this._drawPoint(targetSVGPoint.x, targetSVGPoint.y);

    return this._drawLine(sourceSVGPoint.x, sourceSVGPoint.y, targetSVGPoint.x, targetSVGPoint.y);
  }

  private _getSVGPoint(element: HTMLElement, area: string) {
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

  private _drawPoint(x, y, radius = '0') {
    const shape = this.document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shape.setAttributeNS(null, "cx", x + '');
    shape.setAttributeNS(null, "cy", y + '');
    shape.setAttributeNS(null, "r", radius + '');
    this._svg.appendChild(shape);
  }

  private _drawLine(x1, y1, x2, y2) {
    const line = this.document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1 + '');
    line.setAttribute('y1', y1 + '');
    line.setAttribute('x2', (x2 - 6) + '');
    line.setAttribute('y2', y2 + '');
    line.setAttribute('marker-end', 'url(#arrow)');
    this._svg.appendChild(line);

    return line;
  }
}
