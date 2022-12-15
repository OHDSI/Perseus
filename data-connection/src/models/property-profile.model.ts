import {Model, model, property} from '@loopback/repository';
import {getJsonSchema} from '@loopback/rest';
import {FrequencyDistribution} from './frequency-distribution.model';

@model()
export class PropertyProfile extends Model {
  @property({
    type: 'array',
    required: true,
    jsonSchema: getJsonSchema(FrequencyDistribution),
  })
  frequencyDistribution: FrequencyDistribution[];

  @property({
    type: 'number',
    required: true,
  })
  distinctValues: number;

  @property({
    type: 'object',
    required: false,
    jsonSchema: {
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
  })
  databricks?: object;

  constructor(data?: Partial<PropertyProfile>) {
    super(data);
  }
}

export interface PropertyProfileRelations {
  // describe navigational properties here
}

export type PropertyProfileWithRelations = PropertyProfile &
  PropertyProfileRelations;
