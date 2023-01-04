import {juggler} from '@loopback/repository';
import {writeFile} from 'fs/promises';
import {concatMap, from} from 'rxjs';
import {discoverModelDefinitions} from '../business/bind-model-definitions';
import {DatabricksConfig} from '../models';

export async function main() {
  const ds = new juggler.DataSource(
    new DatabricksConfig({
      connector: 'databricks',
      host: process.env.DATABRICKS_SERVER_HOSTNAME,
      path: process.env.DATABRICKS_HTTP_PATH,
      token: process.env.DATABRICKS_TOKEN,
    }),
  );
  discoverModelDefinitions(ds)
    .pipe(
      concatMap(d => {
        return from(
          writeFile(
            `./src/model-defs/cdm-5-4-scan/${d.name}.json`,
            JSON.stringify(d, null, 2),
          ),
        );
      }),
    )
    .subscribe({});
}

if (require.main === module) {
  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
