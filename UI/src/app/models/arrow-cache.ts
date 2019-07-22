import { IRow } from './row';

export interface Arrow {
  source: IRow;
  target: IRow;
}

export interface ArrowCache {
  [key: string]: Arrow;
}
