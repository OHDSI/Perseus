import {Model, model, property} from '@loopback/repository';
import {assert} from 'console';

enum Connector {
  DATABRICKS = 'databricks',
  POSTGRESQL = 'postgresql',
}

@model()
export class DataSourceConfig extends Model {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Connector)
    }
  })
  connector: string;

  constructor(data?: Partial<DataSourceConfig>) {
    super(data);
  }
}

export interface DataSourceConfigRelations {
  // describe navigational properties here
}

export type DataSourceConfigWithRelations = DataSourceConfig & DataSourceConfigRelations;

@model()
export class DatabricksConfig extends DataSourceConfig {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  host: string;

  @property({
    type: 'string',
    required: true,
  })
  path: string;

  // @property({
  //   type: 'number',
  //   required: true,
  //   default: 443
  // })
  // port = 443;

  // @property({
  //   type: 'string',
  //   required: true,
  //   default: 'https'
  // })
  // protocol = 'https';

  constructor(data?: Partial<DatabricksConfig>) {
    if (data) {
      assert(data?.connector === Connector.DATABRICKS)
    }
    super(data);
  }
}