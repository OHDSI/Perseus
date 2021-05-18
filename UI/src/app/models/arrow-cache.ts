import { IRow } from './row';
import { IConnection } from '../services/bridge.service';

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
 * key - `${sourceTableId}/${targetTableId}-${targetRowId}`
**/
export interface ConstantCache {
  [key: string]: IRow;
}

export interface CorrespondingRows {
  [key: string]: IRow;
}
