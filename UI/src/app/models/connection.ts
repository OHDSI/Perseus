import { IRow, Row } from '@models/row';
import { SqlFunction } from '@popups/rules-popup/transformation-input/model/sql-string-functions';
import { IConnector } from '@models/connector';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { Type } from 'class-transformer';
import { Arrow } from '@models/arrow';

export interface IConnection {
  source: IRow;
  target: IRow;
  connector: IConnector;
  transforms?: SqlFunction[];
  lookup?: {};
  type?: string;
  sql?: SqlForTransformation;
}

export class Connection {

  @Type(() => Row)
  source: IRow;

  @Type(() => Row)
  target: IRow;

  @Type(() => Arrow)
  connector: IConnector;

  transforms?: SqlFunction[];
  lookup?: {};
  type?: string;
  sql?: SqlForTransformation;
}
