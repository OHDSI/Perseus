import {Model, model, property} from '@loopback/repository';
import {getJsonSchema} from '@loopback/rest';
import {PropertyProfile} from './property-profile.model';

@model()
export class ModelProfile extends Model {

  @property({
    type: 'number',
    required: true,
  })
  rowCount: number;

  @property({
    type: 'array',
    itemType: 'object',
    jsonSchema: getJsonSchema(PropertyProfile)
  })
  PropertyProfiles?: PropertyProfile[];


  constructor(data?: Partial<ModelProfile>) {
    super(data);
  }
}

export interface ModelProfileRelations {
  // describe navigational properties here
}

export type ModelProfileWithRelations = ModelProfile & ModelProfileRelations;
