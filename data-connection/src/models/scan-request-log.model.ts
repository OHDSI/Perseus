import {Entity, model, ModelDefinitionSyntax, property} from '@loopback/repository';
import {getJsonSchema} from '@loopback/rest';
import {modelDefinitionJsonSchema} from './model-definition';
import {ModelProfile} from './model-profile.model';

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
    jsonSchema: modelDefinitionJsonSchema,
  })
  modelDefinition?: ModelDefinitionSyntax;

  @property({
    type: 'object',
    jsonSchema: getJsonSchema(ModelProfile)
  })
  modelProfile?: ModelProfile

  constructor(data?: Partial<ScanRequestLog>) {
    super(data);
  }
}

export interface ScanRequestLogRelations {
  // describe navigational properties here
}

export type ScanRequestLogWithRelations = ScanRequestLog & ScanRequestLogRelations;
