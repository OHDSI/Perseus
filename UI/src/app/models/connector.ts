import { IRow } from 'src/app/models/row';

export interface IConnector {
  id: string;
  canvas: any;
  line: Element;
  button: Element;
  source: IRow;
  target: IRow;

  drawLine(): void;
  remove(): void;
  fixPosition(): void;
}

export class Connector {
  public canvas: any;
  public line: Element;
  public button: Element;

  constructor(
    public id: string,
    public source: IRow,
    public target: IRow
  ){
    this.canvas = document.querySelector('.canvas');
  };

  drawLine() {
    const sourceSVGPoint = this._getSVGPoint(this.source);
    const targetSVGPoint = this._getSVGPoint(this.target);

    const id = this.id;

    const {x: x1, y: y1} = sourceSVGPoint;
    const {x: x2, y: y2} = targetSVGPoint;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    line.setAttribute('x1', x1 + '');
    line.setAttribute('y1', y1 + '');
    line.setAttribute('x2', (x2 - 6) + '');
    line.setAttribute('y2', y2 + '');
    line.setAttribute('id', id);
    line.setAttribute('marker-end', 'url(#arrow)');

    this.line = line;
    this.canvas.appendChild(line);
  }

  remove() {
    this.source.removeConnections();
    this.line.remove();
    this.button.remove();
  }

  fixPosition() {
    const sourceSVGPoint = this._getSVGPoint(this.source);
    const targetSVGPoint = this._getSVGPoint(this.target);

    const {x: x1, y: y1} = sourceSVGPoint;
    const {x: x2, y: y2} = targetSVGPoint;

    this.line.setAttribute('x1', x1 + '');
    this.line.setAttribute('y1', y1 + '');
    this.line.setAttribute('x2', (x2 - 6) + '');
    this.line.setAttribute('y2', y2 + '');
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
    const pt = this.canvas.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const svgPoint = pt.matrixTransform(this.canvas.getScreenCTM().inverse());

    return svgPoint;
  }

}