/*
 * key - `${sourceTableId}/${targetTableId}-${targetRowId}`
**/
import { IRow, Row } from '@models/row';

export interface IConstantCache {
  [key: string]: IRow;
}

export class ConstantCache implements IConstantCache {
  // @ts-ignore
  @Type(() => Row)
  [key: string]: IRow;
}
