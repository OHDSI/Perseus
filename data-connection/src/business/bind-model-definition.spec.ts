import assert from 'assert';
import {MockDataSource} from '../test/mock-data-source';
import {discoverModelDefinitions} from './bind-model-definitions';

describe('Typescript usage suite', () => {
  // let app: DataConnectionApplication;

  // before('setupApplication', async () => {
  //   ({app} = await setupApplication());
  // });

  // let testScheduler: TestScheduler
  // beforeEach(() => {
  //   testScheduler = new TestScheduler((actual, expected) => {
  //     assert.strictEqual(actual, expected)
  //     return true
  //   });
  // });

  it('should be able to execute a test', () => {
    assert.strictEqual(true, true);
  });

  it('should discover models from a data source', done => {
    const a = {
      name: 'customer',
      properties: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        c_custkey: {
          type: 'Number',
          databricks: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            col_name: 'c_custkey',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            data_type: 'bigint',
            comment: null,
          },
        },
      },
      settings: {
        databricks: {
          catalog: 'samples',
          database: 'tpch',
          tableName: 'customer',
          isTemporary: false,
        },
      },
      relations: {},
    };
    const ds = new MockDataSource({modelDefinitions: [a]});
    const modelDefinitions = discoverModelDefinitions(ds);
    modelDefinitions.subscribe({
      next: actual => assert.deepStrictEqual(actual, a),
      complete: () => done(),
    });
  });
});
