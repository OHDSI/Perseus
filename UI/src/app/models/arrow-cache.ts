import { IRow } from './row';
import { IConnection, IConnectionState } from '@models/connector.interface';

export interface Arrow {
  source: IRow;
  target: IRow;
}

/*
 * key - `${sourceTableId}-${sourceRowId}/${targetTableId}-${targetRowId}`
**/
export interface ArrowCache {
  [key: string]: IConnection;
}

/*
 * Flyweight weight cope of arrow cache object
**/
export interface ArrowCacheState {
  [key: string]: IConnectionState;
}

/*
 * key - `${sourceTableId}/${targetTableId}-${targetRowId}`
**/
export interface ConstantCache {
  [key: string]: IRow;
}
