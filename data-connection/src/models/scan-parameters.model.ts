import {
  Model,
  model,
  ModelDefinitionSyntax,
  property,
} from '@loopback/repository';
import {modelDefinitionJsonSchema} from './model-definition';

@model()
export class ScanParameters extends Model {
  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  profile: boolean;

  @property({
    type: 'array',
    itemType: 'object',
    jsonSchema: modelDefinitionJsonSchema,
  })
  modelDefinitions?: ModelDefinitionSyntax[];

  constructor(data?: Partial<ScanParameters>) {
    super(data);
  }
}

export interface ScanParametersRelations {
  // describe navigational properties here
}

export type ScanParametersWithRelations = ScanParameters &
  ScanParametersRelations;
