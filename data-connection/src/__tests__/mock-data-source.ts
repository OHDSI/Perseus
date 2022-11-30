import {juggler} from '@loopback/repository';
import {ModelDefinition} from 'loopback-datasource-juggler';
import sampleModelsFixture from '../__tests__/sample-models-fixture.json';
// import sampleModelsFixture from '../__tests__/sample-models-fixture-small.json';

export class MockDataSource extends juggler.DataSource {
  constructor() {
    super()
  }

  async connect(): Promise<void> {}

  async discoverModelDefinitions(): Promise<ModelDefinition[]> {
    return (sampleModelsFixture as []).map(m => m as unknown as ModelDefinition)
  }
}
