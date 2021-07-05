import { ITable, Table } from '@models/table';

export interface IClones {
  [key: string]: ITable[]
}

export class Clones implements IClones {
  // @ts-ignore
  @Type(() => Table)
  [key: string]: ITable[]
}
