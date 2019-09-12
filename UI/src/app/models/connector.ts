import { IRow } from 'src/app/models/row';
import { getSVGPoint } from '../services/utilites/draw-utilites';
import { extractHtmlElement } from '../services/utilites/html-utilities';
import { IConnector } from './interface/connector.interface';

// What is Connector?
export class Connector implements IConnector {
  public canvas: any;
  public line: SVGLineElement;
  public button: Element;

  constructor(public id: string, public source: IRow, public target: IRow) {}

  attachButton(button: any): void {
    throw new Error('Method not implemented.');
  }

  draw() {
    this.canvas = document.querySelector('.canvas');

    const source = this.checkAndChangeHtmlElement(this.source);
    const target = this.checkAndChangeHtmlElement(this.target);

    // TODO Check htmlElement for existance
    const sourceSVGPoint = getSVGPoint(source, this.canvas);
    const targetSVGPoint = getSVGPoint(target, this.canvas);

    const id = this.id;

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.classList.add('arrow');

    line.setAttribute('x1', x1 + '');
    line.setAttribute('y1', y1 + '');
    line.setAttribute('x2', x2 - 6 + '');
    line.setAttribute('y2', y2 + '');
    line.setAttribute('id', id);
    line.setAttribute('marker-end', 'url(#arrow)');

    line.addEventListener('click', this.clickHandler);

    this.line = line;
    this.canvas.appendChild(line);
  }

  remove() {
    if (this.source) {
      this.source.removeConnections();
    }
    if (this.line) {
      this.line.removeEventListener('click', this.clickHandler);
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

  // TODO Move
  active() {
    this.line.classList.add('line-active');
    this.line.removeAttribute('marker-end');
    this.line.setAttribute('marker-end', 'url(#arrow-active)');

    this.source.htmlElement.classList.add('row-active');
    this.target.htmlElement.classList.add('row-active');
  }

  // TODO Move
  inactive() {
    this.line.classList.remove('line-active');
    this.line.removeAttribute('marker-end');
    this.line.setAttribute('marker-end', 'url(#arrow)');

    this.source.htmlElement.classList.remove('row-active');
    this.target.htmlElement.classList.remove('row-active');
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
