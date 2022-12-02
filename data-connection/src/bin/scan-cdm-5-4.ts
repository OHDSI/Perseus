import {writeFile} from 'fs/promises';
import {concatMap, from} from 'rxjs';
import {scan} from '../business/scan';
import {DatabricksConfig, ScanRequest, ScanRequestLog} from '../models';

export async function main() {
  scan(
    new ScanRequest({
      dataSourceConfig: new DatabricksConfig({
        connector: 'databricks',
        host: process.env.DATABRICKS_SERVER_HOSTNAME,
        path: process.env.DATABRICKS_HTTP_PATH,
        token: process.env.DATABRICKS_TOKEN,
      })
    }), undefined, //MockDataSource
  ).pipe(
    concatMap((log: ScanRequestLog) => {
      return from(writeFile(
        `./src/model-defs/cdm-5-4-scan/${log.modelDefinition!.name}.json`,
        JSON.stringify(log.modelDefinition, null, 2),
      ))
    })
  ).subscribe({})
}

if (require.main === module) {
  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
