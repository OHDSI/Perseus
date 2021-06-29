import { IRow, IRowState } from './row';
import { EventEmitter } from '@angular/core';
import { SqlFunction } from '@popups/rules-popup/transformation-input/model/sql-string-functions';

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
  setEndMarkerType(type: string): void;
}

export interface IConnectorState {
  id: string;
  source: IRowState;
  target: IRowState;
  selected: boolean;
  type: ConnectorType;
}

export type ConnectorType = 'L' | 'T' | 'M' | '';

export interface IConnection {
  source: IRow;
  target: IRow;
  connector: IConnector;
  transforms?: SqlFunction[];
  lookup?: {};
  type?: string;
  sql?: {};
}

export interface IConnectionState {
  source: IRowState;
  target: IRowState;
  connector: IConnectorState,
  transforms?: SqlFunction[];
  lookup?: {};
  type?: string;
  sql?: {};
}
