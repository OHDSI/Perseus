import {Model, model, property} from '@loopback/repository';

export type DataSourceConfig = MockConfig | DatabricksConfig

@model()
export class MockConfig extends Model {

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      const: 'mock',
    },
  })
  connector: string;

  constructor(data?: Partial<MockConfig>) {
    super(data);
  }
}

@model()
export class DatabricksConfig extends Model {

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      const: 'databricks',
    },
  })
  connector: string;

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
    super(data);
  }
}
