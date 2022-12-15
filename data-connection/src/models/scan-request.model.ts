import {Entity, hasMany, model, property} from '@loopback/repository';
import {getJsonSchema} from '@loopback/rest';
import {DatabricksConfig, DataSourceConfig} from './data-source-config.model';
import {ScanParameters} from './scan-parameters.model';
import {ScanRequestLog} from './scan-request-log.model';

@model()
export class ScanRequest extends Entity {
  @property({
    type: 'number',
    id: true,
    // required: true,
  })
  id: number;

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      anyOf: [getJsonSchema(DatabricksConfig)],
    },
  })
  dataSourceConfig: DataSourceConfig;

  @property({
    type: 'object',
    default: {profile: false},
    jsonSchema: getJsonSchema(ScanParameters),
  })
  scanParameters?: ScanParameters;

  @hasMany(() => ScanRequestLog)
  logs: ScanRequestLog[];

  constructor(data?: Partial<ScanRequest>) {
    super(data);
  }
}

export interface ScanRequestRelations {
  // logs?: ScanRequestLogWithRelations[]
}

export type ScanRequestWithRelations = ScanRequest & ScanRequestRelations;
