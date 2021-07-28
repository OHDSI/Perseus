import { IRow } from 'src/app/models/row';
import { getSVGPoint } from '@utils/draw-utilites';
import { ConnectorType, IConnectionView, IConnector } from './connector';
import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { Exclude } from 'class-transformer';
import { checkAndChangeHtmlElement, generateSvgPath } from '@utils/arrow';

// TODO Hide properties with WeakMap

const markerEndAttributeIndex = 9;

export class Arrow implements IConnector {
  selected = false;

  @Exclude()
  view: IConnectionView;

  constructor(
    canvasRef: ElementRef,
    public id: string,
    public source: IRow,
    public target: IRow,
    public type: ConnectorType,
    renderer: Renderer2
  ) {
    this.view = {
      canvas: canvasRef ? canvasRef.nativeElement : null,
      clicked: new EventEmitter<IConnector>(),
      renderer
    }
  }

  get renderer() {
    return this.view.renderer
  }

  get sourceSVGPoint() {
    return this.view.sourceSVGPoint
  }

  set sourceSVGPoint(value) {
    this.view.sourceSVGPoint = value
  }

  get targetSVGPoint() {
    return this.view.targetSVGPoint
  }

  set targetSVGPoint(value) {
    this.view.targetSVGPoint = value
  }

  get canvas() {
    return this.view.canvas
  }

  get path() {
    return this.view.path
  }

  set path(value) {
    this.view.path = value
  }

  get svgPath(): SVGLineElement {
    return this.path
  }

  get removeClickListener() {
    return this.view.removeClickListener
  }

  set removeClickListener(value) {
    this.view.removeClickListener = value
  }

  get title() {
    return this.view.title
  }

  set title(value) {
    this.view.title = value
  }

  get titleText() {
    return this.view.titleText
  }

  set titleText(value) {
    this.view.titleText = value
  }

  get button() {
    return this.view.button
  }

  set button(value) {
    this.view.button = value
  }

  get clicked() {
    return this.view.clicked
  }

  draw(): void {
    let source;
    let target;

    source = checkAndChangeHtmlElement(this.source);
    target = checkAndChangeHtmlElement(this.target);

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
      generateSvgPath([x1, y1], [x2, y2])
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
      generateSvgPath([x1, y1], [x2, y2])
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

  /**
   * @param state - select or deselect
   */
  toggle(state: boolean) {
    this.refreshPathHtmlElement();

    const isTypeT = this.svgPath.attributes[markerEndAttributeIndex].value.endsWith('-T)');
    const isTypeL = this.svgPath.attributes[markerEndAttributeIndex].value.endsWith('-L)');
    const isTypeM = this.svgPath.attributes[markerEndAttributeIndex].value.endsWith('-M)');
    const hasConcept = this.svgPath.attributes[markerEndAttributeIndex].value.endsWith('-concept)');
    const markerType = hasConcept ? '-concept' : isTypeL ? '-L' : isTypeT ? '-T' : isTypeM ? '-M' : '';
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

  private refreshPathHtmlElement() {
    const id = this.path.attributes.id.nodeValue;
    this.path = document.getElementById(id);
  }
}
