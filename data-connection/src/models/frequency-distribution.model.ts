import {Model, model, property} from '@loopback/repository';

@model()
export class FrequencyDistribution extends Model {
  @property({
    type: 'string',
    required: true,
  })
  bucketName: string;

  @property({
    type: 'number',
    required: true,
  })
  bucketCount: number;

  @property({
    type: 'number',
    required: true,
  })
  percentage: number;


  constructor(data?: Partial<FrequencyDistribution>) {
    super(data);
  }
}

export interface FrequencyDistributionRelations {
  // describe navigational properties here
}

export type FrequencyDistributionWithRelations = FrequencyDistribution & FrequencyDistributionRelations;
