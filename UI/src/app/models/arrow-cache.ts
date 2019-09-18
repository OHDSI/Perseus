import { IRow } from './row';
import { IConnection } from '../services/bridge.service';

export interface Arrow {
  source: IRow;
  target: IRow;
}

export interface ArrowCache {
  [key: string]: IConnection;
}
