import {juggler} from '@loopback/repository';
import {ModelDefinition} from 'loopback-datasource-juggler';

export class MockDataSource extends juggler.DataSource {
  constructor(
    private options: {
      modelDefinitions?: object[];
      executeResults?: object[];
    },
  ) {
    super();
  }

  async connect(): Promise<void> {}

  async discoverModelDefinitions(): Promise<ModelDefinition[]> {
    return this.options.modelDefinitions!.map(
      m => m as unknown as ModelDefinition,
    );
  }

  async execute(): Promise<object[]> {
    return this.options.executeResults!
  }
}
