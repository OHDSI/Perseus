import { IRow } from 'src/app/models/row';
import { getSVGPoint } from '../services/utilites/draw-utilites';
import { extractHtmlElement } from '../services/utilites/html-utilities';
import { IConnector } from './interface/connector.interface';
import { Renderer2, ElementRef, EventEmitter } from '@angular/core';

// TODO Hide properties with WeakMap

export class Arrow implements IConnector {
  clicked = new EventEmitter<IConnector>();

  canvas: any;
  svgPath: SVGLineElement;
  button: Element;
  selected = false;

  sourceSVGPoint: any;
  targetSVGPoint: any;

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

  private generateSvgPath(pointStart: number[], pointEnd: number[]): string {
    const x1 = pointStart[0];
    const y1 = pointStart[1];
    const x2 = pointEnd[0];
    const y2 = pointEnd[1];

    // M173,475 C326,467 137,69 265,33
    return `M${x1},${y1} C${x1 + 200},${y1} ${x2 - 200},${y2} ${x2},${y2}`;
  }

  draw(): void {
    const source = this.checkAndChangeHtmlElement(this.source);
    const target = this.checkAndChangeHtmlElement(this.target);

    // TODO Check htmlElement for existance
    this.sourceSVGPoint = getSVGPoint(source, this.canvas);
    this.targetSVGPoint = getSVGPoint(target, this.canvas);

    const id = this.id;

    const { x: x1, y: y1 } = this.sourceSVGPoint;
    const { x: x2, y: y2 } = this.targetSVGPoint;

    const path = this.renderer.createElement('path', 'svg');

    this.renderer.addClass(path, 'arrow');

    this.renderer.setAttribute(
      path,
      'd',
      this.generateSvgPath([x1, y1], [x2, y2])
    );

    this.renderer.setAttribute(path, 'fill', 'none');
    this.renderer.setAttribute(path, 'stroke', 'grey');
    this.renderer.setAttribute(path, 'id', id);
    this.renderer.setAttribute(path, 'middleY', Math.floor((y1 + y2) / 2).toString());
    this.renderer.setAttribute(path, 'startXY', `${x1},${y1}`);
    this.renderer.setAttribute(path, 'endXY', `${x1},${y1}`);

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
    event.stopPropagation();
    this.clicked.emit(this);
    //this.select();
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
