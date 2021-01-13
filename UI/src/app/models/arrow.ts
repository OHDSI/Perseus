import { IRow } from 'src/app/models/row';
import { getSVGPoint } from '../services/utilites/draw-utilites';
import { extractHtmlElement } from '../services/utilites/html-utilities';
import { IConnector, ConnectorType } from './interface/connector.interface';
import { Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { ConceptService, isConcept } from '../components/comfy/services/concept.service';

// TODO Hide properties with WeakMap

const markerEndAttributeIndex = 9;

export class Arrow implements IConnector {
  clicked: EventEmitter<IConnector>;

  get svgPath(): SVGLineElement {
    return this.path;
  }

  canvas: any;
  button: Element;
  selected = false;

  sourceSVGPoint: any;
  targetSVGPoint: any;

  path: any;
  title: any;
  titleText: any;
  type: ConnectorType;

  private removeClickListener: any;

  constructor(
    canvasRef: ElementRef,
    public id: string,
    public source: IRow,
    public target: IRow,
    type: ConnectorType,
    private renderer: Renderer2
  ) {
    this.canvas = canvasRef ? canvasRef.nativeElement : null;
    this.clicked = new EventEmitter<IConnector>();
    this.type = type;
  }

  private getType() {
    if (isConcept(this)) {
      return 'L';
    } else {
      return 'T';
    }
  }

  draw(): void {

    let source;
    let target;

    source = this.checkAndChangeHtmlElement(this.source);
    target = this.checkAndChangeHtmlElement(this.target);

      // TODO Check htmlElement for existance
    this.sourceSVGPoint = getSVGPoint(source, this.canvas);
    this.targetSVGPoint = getSVGPoint(target, this.canvas);

    if (!this.sourceSVGPoint || !this.targetSVGPoint) {
      return;
    }

    const id = this.id;

    const { x: x1, y: y1 } = this.sourceSVGPoint;
    const { x: x2, y: y2 } = this.targetSVGPoint;

    this.path = this.renderer.createElement('path', 'svg');

    this.renderer.addClass(this.path, 'arrow');

    this.renderer.setAttribute(
      this.path,
      'd',
      this.generateSvgPath([x1, y1], [x2, y2])
    );

    this.renderer.setAttribute(this.path, 'fill', 'none');
    this.renderer.setAttribute(this.path, 'stroke', 'grey');
    this.renderer.setAttribute(this.path, 'id', id);
    this.renderer.setAttribute(
      this.path,
      'middleY',
      Math.floor((y1 + y2) / 2).toString()
    );
    this.renderer.setAttribute(this.path, 'startXY', `${x1},${y1}`);
    this.renderer.setAttribute(this.path, 'endXY', `${x2},${y2}`);

    this.renderer.setAttribute(this.path, 'marker-start', 'url(#marker-start)');
    this.renderer.setAttribute(this.path, 'marker-end', `url(#marker-end${this.type ? `-${this.type}` : ''})`);

    this.removeClickListener = this.renderer.listen(
      this.path,
      'click',
      this.clickHandler.bind(this)
    );

    this.renderer.appendChild(this.canvas, this.path);
    this.title = this.renderer.createElement('title', 'svg');
    this.titleText = this.renderer.createText(`${this.source.name} - ${this.target.name}`);
    this.renderer.appendChild(this.title, this.titleText);
    this.renderer.appendChild(this.path, this.title);
  }

  adjustPosition() {
    const sourceSVGPoint = getSVGPoint(this.source, this.canvas);
    const targetSVGPoint = getSVGPoint(this.target, this.canvas);

    if (!sourceSVGPoint || !targetSVGPoint) {
      return;
    }

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;

    this.renderer.setAttribute(
      this.path,
      'd',
      this.generateSvgPath([x1, y1], [x2, y2])
    );

    this.renderer.setAttribute(this.path, 'startXY', `${x1},${y1}`);
    this.renderer.setAttribute(this.path, 'endXY', `${x2},${y2}`);
  }

  attachButton(button) {
    this.button = button;
  }

  setEndMarkerType(type): void {
    if (this.svgPath) {
      this.refreshPathHtmlElement();
      if (this.svgPath) {

        const isActive = this.svgPath.attributes[ markerEndAttributeIndex ].value.includes('active');

        this.renderer.removeAttribute(this.svgPath, 'marker-end');

        this.type = type === 'None' ? '' : type;
        const markerType = type === 'None' ? '' : `-${type}`;
        const markerState = isActive ? '-active' : '';
        const markerEnd = `url(#marker-end${markerState}${markerType})`;

        this.renderer.setAttribute(this.svgPath, 'marker-end', markerEnd);
      }
    }
  }

  select() {
    this.toggle(true);
  }

  deselect(): void {
    this.toggle(false);
  }

  toggle(state) {
    this.refreshPathHtmlElement();

    const isTypeT = this.svgPath.attributes[markerEndAttributeIndex].value.endsWith('-T)');
    const isTypeL = this.svgPath.attributes[markerEndAttributeIndex].value.endsWith('-L)');
    const isTypeM = this.svgPath.attributes[markerEndAttributeIndex].value.endsWith('-M)');
    const markerType = isTypeL ? '-L' : isTypeT ? '-T' : isTypeM ? '-M' : '';
    const markerState = state ? '-active' : '';

    this.renderer.removeAttribute(this.svgPath, `marker-start`);
    this.renderer.removeAttribute(this.svgPath, `marker-end`);

    this.selected = state;
    state ? this.renderer.addClass(this.svgPath, 'selected') : this.renderer.removeClass(this.svgPath, 'selected');

    this.renderer.setAttribute(this.svgPath, 'marker-start', `url(#marker-start${markerState})`);
    this.renderer.setAttribute(this.svgPath, 'marker-end', `url(#marker-end${markerState}${markerType})`);
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
    const markerWidth = 16;
    if (event.offsetX < markerWidth || event.offsetX > event.currentTarget.parentElement.clientWidth - markerWidth) {
      return;
    }

    this.clicked.emit(this);

    if (this.selected) {
      this.deselect();
    } else {
      this.select();
    }
  }

  private generateSvgPath(pointStart: number[], pointEnd: number[]): string {
    const x1 = pointStart[0];
    const y1 = pointStart[1];
    const x2 = pointEnd[0];
    const y2 = pointEnd[1];

    // M173,475 C326,467 137,69 265,33
    return `M${x1},${y1} C${x1 + 200},${y1} ${x2 - 200},${y2} ${x2},${y2}`;
  }

  private refreshPathHtmlElement() {
    const id = this.path.attributes.id.nodeValue;
    this.path = document.getElementById(id);
  }

  private checkAndChangeHtmlElement(row: IRow): IRow {
    const foundElements = document.getElementsByClassName(
      `item-${row.area}-${row.tableName}-${row.cloneTableName ? row.cloneTableName : ''}-${row.cloneConnectedToSourceName ? row.cloneConnectedToSourceName : ''}-${row.name}`
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
