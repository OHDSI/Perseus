import {JsonSchemaWithExtensions} from '@loopback/repository';

export const modelDefinitionJsonSchema: JsonSchemaWithExtensions = {
  properties: {
    name: {
      type: 'string',
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
                // There appears to be a bug so that only the
                // first option ('string') is used. To workaround
                // we don't specify the type.
                // type: ['string', 'null'],
              },
            },
          },
        },
      },
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
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
