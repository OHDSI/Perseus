import {Model, model, property} from '@loopback/repository';
import {getJsonSchema} from '@loopback/rest';
import {FrequencyDistribution} from './frequency-distribution.model';

@model()
export class PropertyProfile extends Model {
  @property({
    type: 'array',
    itemType: 'object',
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
