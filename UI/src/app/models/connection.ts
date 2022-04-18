import { IRow, Row } from '@models/row';
import { IConnector } from '@models/connector';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { Type } from 'class-transformer';
import { Arrow } from '@models/arrow';
import { Lookup } from '@models/perseus/lookup'
import { SqlFunction } from '@models/transformation-input/sql-string-functions'

export interface IConnection {
  source: IRow;
  target: IRow;
  connector: IConnector;
  transforms?: SqlFunction[];
  lookup?: Lookup
  type?: string;
  sql?: SqlForTransformation;
}

export class Connection implements IConnection {
  @Type(() => Row)
  source: IRow;

  @Type(() => Row)
  target: IRow;

  @Type(() => Arrow)
  connector: IConnector;

  transforms?: SqlFunction[];
  lookup?: Lookup
  type?: string;
  sql?: SqlForTransformation;
}
