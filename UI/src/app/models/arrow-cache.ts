import { Connection, IConnection } from '@models/connection';
import { Type } from 'class-transformer';

/*
 * key - `${sourceTableId}-${sourceRowId}/${targetTableId}-${targetRowId}`
**/
export interface IArrowCache {
  [key: string]: IConnection;
}

export class ArrowCache implements IArrowCache {
  // @ts-ignore
  @Type(() => Connection)
  [key: string]: IConnection;
}
