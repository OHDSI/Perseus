import assert from 'assert';
import {DataConnectionApplication} from '../application';
import {DatabricksConfig, ScanRequest} from '../models';
import {setupApplication} from '../__tests__/acceptance/test-helper';
import {MockDataSource} from '../__tests__/mock-data-source';
import {scan} from './scan';

describe("Typescript usage suite", () => {

  let app: DataConnectionApplication;

  before('setupApplication', async () => {
    ({app} = await setupApplication());
  });

  it("should be able to execute a test", () => {
    assert.strictEqual(true, true);
  });

  it("should return a scan request id", () => {
    scan(
      new ScanRequest({
        dataSourceConfig: new DatabricksConfig({
          connector: 'databricks',
          host: process.env.DATABRICKS_SERVER_HOSTNAME,
          path: process.env.DATABRICKS_HTTP_PATH,
          token: process.env.DATABRICKS_TOKEN,
        })
      }), app, MockDataSource
    ).subscribe({
      next: log => {
        assert.strictEqual(true, true);
      },
      complete: () => {
        assert.strictEqual(true, true);
      }
    })
  });
});
