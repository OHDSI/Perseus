import {juggler} from '@loopback/repository';
import {DataConnectionApplication} from '../application';
import {DataSourceConfig} from '../models';
import {MockDataSource} from '../test/mock-data-source';
import sampleModelDefinitions from '../test/sample-models-fixture.json';
import sampleProfiles from '../test/sample-profiles-fixture.json';

export const getOrBindDataSource = async (
  key: string,
  dataSourceConfig: DataSourceConfig,
  app: DataConnectionApplication,
) => {
  const dsKey = `datasources.${key}`;
  if (app.isBound(dsKey)) {
    return app.get<juggler.DataSource>(dsKey);
  } else {
    return bindDataSource(key, dataSourceConfig, app);
  }
};

export const bindDataSource = (
  key: string,
  dataSourceConfig: DataSourceConfig,
  app: DataConnectionApplication,
): juggler.DataSource => {
  // const {connector, ...config} = dataSourceConfig
  // const ds = new juggler.DataSource({
  //   name: key,
  //   connector: require(`loopback-connector-${connector}`),
  //   ...config
  // })
  const ds = new MockDataSource({
    modelDefinitions: sampleModelDefinitions,
    executeResults: sampleProfiles,
  });
  app.dataSource(ds, key);
  return ds;
};
