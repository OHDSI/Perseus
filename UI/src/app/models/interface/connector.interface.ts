import { IRow } from '../row';
import { EventEmitter } from '@angular/core';

export interface IConnector {
  id: string;
  canvas: any;
  svgPath: Element;
  source: IRow;
  target: IRow;
  selected: boolean;
  button: Element;
  clicked: EventEmitter<IConnector>;
  type: ConnectorType;

  draw(): void;
  remove(): void;
  adjustPosition(): void;
  attachButton(button): void;
  select(): void;
  deselect(): void;
}

export type ConnectorType = 'L' | 'T';
