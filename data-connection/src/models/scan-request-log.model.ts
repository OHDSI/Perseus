import {Entity, model, ModelDefinitionSyntax, property} from '@loopback/repository';

export enum Status {
  COMPLETE = 'complete',
  IN_PROGRESS = 'in progress'
}

@model()
export class ScanRequestLog extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  scanRequestId: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Status)
    }
  })
  status: string;

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        name: {
          type: 'string'
        },
        properties: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
              },
              databricks: {
                type: 'object',
                properties: {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  col_name: {
                    type: 'string',
                  },
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  data_type: {
                    type: 'string',
                  },
                  comment: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        settings: {
          type: 'object',
          properties: {
            databricks: {
              type: 'object',
              properties: {
                catalog: {
                  type: 'string',
                },
                database: {
                  type: 'string',
                },
                tableName: {
                  type: 'string',
                },
                isTemporary: {
                  type: 'boolean'
                }
              }
            }
          }
        }
      }
    }
  })
  modelDefinition?: ModelDefinitionSyntax;

  constructor(data?: Partial<ScanRequestLog>) {
    super(data);
  }
}

export interface ScanRequestLogRelations {
  // describe navigational properties here
}

export type ScanRequestLogWithRelations = ScanRequestLog & ScanRequestLogRelations;
