import {juggler, Repository} from '@loopback/repository';
import {ModelProfile} from '../models';

export class ModelProfileRepository implements Repository<ModelProfile> {
  constructor(private connector: juggler.DataSource) {}

  async findLatest(): Promise<ModelProfile[]> {
    return this.connector.execute(`
      SELECT * FROM ModelProfile
    `);
  }
}
