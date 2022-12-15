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
      enum: Object.values(Connector),
    },
  })
  connector: string;

  constructor(data?: Partial<DataSourceConfig>) {
    super(data);
  }
}

export interface DataSourceConfigRelations {
  // describe navigational properties here
}

export type DataSourceConfigWithRelations = DataSourceConfig &
  DataSourceConfigRelations;

@model()
export class DatabricksConfig extends DataSourceConfig {
  @property({
    type: 'string',
  })
  token?: string;

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

  @property({
    type: 'number',
    default: 443,
  })
  port = 443;

  @property({
    type: 'string',
    default: 'https',
  })
  protocol = 'https';

  @property({
    type: 'string',
  })
  profileNotebook?: string;

  constructor(data?: Partial<DatabricksConfig>) {
    if (data) {
      assert(data?.connector === Connector.DATABRICKS);
    }
    super(data);
  }
}
