import { IRow } from 'src/app/models/row';
import { getSVGPoint } from '../services/utilites/draw-utilites';
import { extractHtmlElement } from '../services/utilites/html-utilities';
import { IConnector } from './interface/connector.interface';
import { Renderer2, ElementRef } from '@angular/core';

// TODO Hide properties with WeakMap

export class Arrow implements IConnector {
  canvas: any;
  svgPath: SVGLineElement;
  button: Element;
  selected = false;

  private removeClickListener: any;

  constructor(
    canvasRef: ElementRef,
    public id: string,
    public source: IRow,
    public target: IRow,
    private renderer: Renderer2
  ) {
    this.canvas = canvasRef.nativeElement;
  }

  draw() {
    const source = this.checkAndChangeHtmlElement(this.source);
    const target = this.checkAndChangeHtmlElement(this.target);

    // TODO Check htmlElement for existance
    const sourceSVGPoint = getSVGPoint(source, this.canvas);
    const targetSVGPoint = getSVGPoint(target, this.canvas);

    const id = this.id;

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;

    const line = this.renderer.createElement('line', 'svg');

    this.renderer.addClass(line, 'arrow');
    this.renderer.setAttribute(line, 'x1', x1 + '');
    this.renderer.setAttribute(line, 'y1', y1 + '');
    this.renderer.setAttribute(line, 'x2', x2 - 6 + '');
    this.renderer.setAttribute(line, 'y2', y2 + '');
    this.renderer.setAttribute(line, 'id', id);

    this.renderer.setAttribute(line, 'marker-end', 'url(#arrow)');

    this.removeClickListener = this.renderer.listen(
      line,
      'click',
      this.clickHandler.bind(this)
    );

    this.svgPath = line;

    this.renderer.appendChild(this.canvas, line);
  }

  drawPath() {
    const source = this.checkAndChangeHtmlElement(this.source);
    const target = this.checkAndChangeHtmlElement(this.target);

    // TODO Check htmlElement for existance
    const sourceSVGPoint = getSVGPoint(source, this.canvas);
    const targetSVGPoint = getSVGPoint(target, this.canvas);

    const id = this.id;

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;

    const line = (pointA, pointB) => {
      const lengthX = pointB[0] - pointA[0];
      const lengthY = pointB[1] - pointA[1];
      return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
      };
    };

    const controlPoint = (current, previous, next, reverse?) => {
      // When 'current' is the first or last point of the array
      // 'previous' or 'next' don't exist.
      // Replace with 'current'
      const p = previous || current;
      const n = next || current;
      // The smoothing ratio
      const smoothing = 0.1;
      // Properties of the opposed-line
      const o = line(p, n);
      // If is end-control-point, add PI to the angle to go backward
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * smoothing;
      // The control point position is relative to the current point
      const x = current[0] + Math.cos(angle) * length;
      const y = current[1] + Math.sin(angle) * length;
      return [x, y];
    };

    const lineCommand = point => `L ${point[0]} ${point[1]}`;

    const bezierCommand = (point, i, a) => {
      // start control point
      const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
      // end control point
      const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
      return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    };

    const svgPath = (points, command) => {
      // build the d attributes by looping over the points
      const d = points.reduce(
        (acc, point, i, a) =>
          i === 0
            ? `M ${point[0]},${point[1]}`
            : `${acc} ${command(point, i, a)}`,
        ''
      );
      // return `<path d="${d}" fill="none" stroke="grey" />`;
      return d;
    };

    const createPath = (pointA, pointB) => {
      const lengthX = pointB[0] - pointA[0];
      const lengthY = pointB[1] - pointA[1];
      const middle = [
        Math.floor((pointA[0] + pointB[0]) / 2),
        Math.floor((pointA[1] + pointB[1]) / 2)
      ];

      const angle = Math.atan2(lengthY, lengthX);

      const gap = 20;

      if (angle === 0) {
        return [pointA, pointB];
      } else if (angle > 0) {
        return [
          pointA,
          [middle[0], pointA[1] + gap],
          [middle[0], pointB[1] - gap],
          pointB
        ];
      } else if (angle < 0) {
        return [
          pointA,
          [middle[0], pointA[1] - gap],
          [middle[0], pointB[1] + gap],
          pointB
        ];
      }
    };

    const path = this.renderer.createElement('path', 'svg');

    this.renderer.addClass(path, 'arrow');

    this.renderer.setAttribute(
      path,
      'd',
      svgPath(createPath([x1, y1], [x2, y2]), bezierCommand)
    );

    this.renderer.setAttribute(path, 'fill', 'none');
    this.renderer.setAttribute(path, 'stroke', 'grey');

    this.renderer.setAttribute(path, 'id', id);

    this.renderer.setAttribute(path, 'marker-end', 'url(#arrow)');

    this.removeClickListener = this.renderer.listen(
      path,
      'click',
      this.clickHandler.bind(this)
    );

    this.svgPath = path;

    this.renderer.appendChild(this.canvas, path);
  }

  attachButton(button) {
    this.button = button;
  }

  select() {
    this.renderer.removeAttribute(this.svgPath, 'marker-end');

    this.selected = true;
    this.renderer.addClass(this.svgPath, 'selected');
    this.renderer.setAttribute(
      this.svgPath,
      'marker-end',
      'url(#arrow-active)'
    );
  }

  deselect(): void {
    this.renderer.removeAttribute(this.svgPath, 'marker-end');

    this.selected = false;
    this.renderer.removeClass(this.svgPath, 'selected');
    this.renderer.setAttribute(this.svgPath, 'marker-end', 'url(#arrow)');
  }

  remove() {
    if (this.source) {
      this.source.removeConnections();
    }
    if (this.svgPath) {
      if (this.removeClickListener) {
        this.removeClickListener();
      }

      this.svgPath.remove();
    }
    if (this.button) {
      this.button.remove();
    }
  }

  clickHandler(event: any) {
    this.select();
  }

  adjustPosition() {
    const sourceSVGPoint = getSVGPoint(this.source, this.canvas);
    const targetSVGPoint = getSVGPoint(this.target, this.canvas);

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;

    this.svgPath.setAttribute('x1', x1 + '');
    this.svgPath.setAttribute('y1', y1 + '');
    this.svgPath.setAttribute('x2', x2 - 6 + '');
    this.svgPath.setAttribute('y2', y2 + '');
  }

  private checkAndChangeHtmlElement(row: IRow): IRow {
    const foundElements = document.getElementsByClassName(
      `item-${row.tableName}-${row.name}`
    );
    const foundElement = extractHtmlElement(foundElements, null);

    if (foundElement) {
      row.htmlElement = foundElement;
    } else {
      const tableElements = document.getElementsByClassName(
        `panel-header-${row.tableName}`
      );
      row.htmlElement = extractHtmlElement(tableElements, row.htmlElement);
    }

    return row;
  }
}
