import {Model, model, property} from '@loopback/repository';
import {getJsonSchema} from '@loopback/rest';
import {FrequencyDistribution} from './frequency-distribution.model';

@model()
export class PropertyProfile extends Model {

  @property({
    type: 'array',
    required: true,
    jsonSchema: getJsonSchema(FrequencyDistribution)
  })
  frequencyDistribution: FrequencyDistribution[];


  constructor(data?: Partial<PropertyProfile>) {
    super(data);
  }
}

export interface PropertyProfileRelations {
  // describe navigational properties here
}

export type PropertyProfileWithRelations = PropertyProfile & PropertyProfileRelations;
