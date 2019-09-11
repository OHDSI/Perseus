import { IRow } from 'src/app/models/row';
import { getSVGPoint } from '../services/utilites/draw-utilites';
import { extractHtmlElement } from '../services/utilites/html-utilities';
import { IConnector } from './interface/connector.interface';
import { Renderer2, ElementRef } from '@angular/core';

// TODO Hide properties with WeakMap

export class Arrow implements IConnector {
  public line: SVGLineElement;
  public button: Element;

  private removeClickListener: any;

  constructor(
    public canvas: ElementRef,
    public id: string,
    public source: IRow,
    public target: IRow,
    private renderer: Renderer2
  ) {}

  draw() {
    const source = this.checkAndChangeHtmlElement(this.source);
    const target = this.checkAndChangeHtmlElement(this.target);

    // TODO Check htmlElement for existance
    const sourceSVGPoint = getSVGPoint(source, this.canvas.nativeElement);
    const targetSVGPoint = getSVGPoint(target, this.canvas.nativeElement);

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

    this.removeClickListener = this.renderer.listen(line, 'click', this.clickHandler);

    this.line = line;

    this.renderer.appendChild(this.canvas.nativeElement, line);
  }

  remove() {
    if (this.source) {
      this.source.removeConnections();
    }
    if (this.line) {
      this.removeClickListener();
      this.line.remove();
    }
    if (this.button) {
      this.button.remove();
    }
  }

  clickHandler(event: any) {
    event.stopPropagation();
  }

  adjustPosition() {
    const sourceSVGPoint = getSVGPoint(this.source, this.canvas);
    const targetSVGPoint = getSVGPoint(this.target, this.canvas);

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;

    this.line.setAttribute('x1', x1 + '');
    this.line.setAttribute('y1', y1 + '');
    this.line.setAttribute('x2', x2 - 6 + '');
    this.line.setAttribute('y2', y2 + '');
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
