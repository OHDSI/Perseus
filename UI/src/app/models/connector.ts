import { IRow } from './row';
import { EventEmitter, Renderer2 } from '@angular/core';

export interface IConnector {
  id: string;
  source: IRow;
  target: IRow;
  selected: boolean;
  type: ConnectorType;

  view: IConnectionView

  draw(): void;
  remove(): void;
  adjustPosition(): void;
  attachButton(button): void;
  select(): void;
  deselect(): void;
  setEndMarkerType(type: string): void;
}

export interface IConnectionView {
  canvas: any;
  svgPath?: Element;
  button?: Element;
  clicked: EventEmitter<IConnector>;
  path?: any;
  sourceSVGPoint?: DOMPoint;
  targetSVGPoint?: DOMPoint;
  renderer: Renderer2;
  removeClickListener?: () => void,
  title?: any
  titleText?: any
}

export type ConnectorType = 'L' | 'T' | 'M' | '';

