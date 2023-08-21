import {get, getModelSchemaRef, response} from '@loopback/rest';
import {ModelProfile} from '../models';
import {ModelProfileRepository} from '../repositories';

export class ModelProfileController {
  constructor(private repository: ModelProfileRepository) {}

  @get('/ModelProfile')
  @response(200, {
    description: 'Latest model profiles.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ModelProfile, {includeRelations: true}),
        },
      },
    },
  })
  async findLatest(): Promise<ModelProfile[]> {
    return this.repository.findLatest();
  }
}
