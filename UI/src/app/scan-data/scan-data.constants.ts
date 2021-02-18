import { cdmBuilderLogUrl, whiteRabbitPrefix, whiteRabbitUrl } from '../app.constants';
import { DbSettings } from './model/db-settings';
import { adaptDbType } from './util/cdm-adapter';

/* Name uses in UI and White Rabbit */
export enum DbTypes {
  MYSQL = 'MySQL',
  ORACLE = 'Oracle',
  POSTGRESQL = 'PostgreSQL',
  REDSHIFT = 'Redshift',
  SQL_SERVER = 'SQL Server',
  AZURE = 'Azure',
  MS_ACCESS = 'MS Access',
  TERADATA = 'Teradata',
  BIGQUERY = 'BigQuery',
  PDW = 'PDW',
  NETEZZA = 'Netezza',
  IMPALA = 'Impala',
  SQLITE = 'SQLite',
  HIVE = 'Hive',
}

/* Name uses in UI and White Rabbit */
enum FileTypes {
  CSV = 'CSV files'
}

export const whiteRabbitDatabaseTypes: string[] = [
  DbTypes.MYSQL,
  DbTypes.ORACLE,
  DbTypes.POSTGRESQL,
  DbTypes.REDSHIFT,
  DbTypes.SQL_SERVER,
  DbTypes.AZURE,
  DbTypes.MS_ACCESS,
  DbTypes.TERADATA,
  DbTypes.BIGQUERY,
];

export const dbTypesRequireSchema: string[] = [
  DbTypes.ORACLE,
  DbTypes.POSTGRESQL,
  DbTypes.SQL_SERVER
];

export const delimitedFiles: string[] = [
  FileTypes.CSV
];

export const cdmBuilderDatabaseTypes: string[] = [
  DbTypes.POSTGRESQL,
  DbTypes.SQL_SERVER,
  DbTypes.MYSQL
];

export const fakeData = 'Fake Data';

export const whiteRabbitWebsocketConfig = {
  url: whiteRabbitUrl,
  prefix: whiteRabbitPrefix,
  progressMessagesDestination: '/user/queue/reply',
};

export const cdmWebsocketConfig = {
  url: cdmBuilderLogUrl,
  prefix: '',
  progressMessagesDestination: 'Log',
};

export const dictionaryDbSettingForCdmBuilder = {
  vocabularyEngine: adaptDbType(DbTypes.POSTGRESQL),
  vocabularyServer: '10.110.1.7',
  vocabularyPort: 5431,
  vocabularyDatabase: 'cdm_souffleur',
  vocabularySchema: 'vocabulary',
  vocabularyUser: 'cdm_builder',
  vocabularyPassword: 'N7jscuS3ca',
  mappingsName: 'TestMappings'
};

export const uniformSamplingTooltipText = 'For all fields, choose every possible value with the same probability';

export const fakeDataDbSettings: DbSettings = {
  dbType: DbTypes.POSTGRESQL,
  server: '10.110.1.7',
  database: 'cdm_souffleur',
  user: 'postgres',
  password: '5eC_DkMr^3',
  schema: 'public'
};

export const dqdDatabaseTypes = [
  DbTypes.SQL_SERVER,
  DbTypes.POSTGRESQL,
  DbTypes.ORACLE,
  DbTypes.PDW,
  DbTypes.REDSHIFT,
  DbTypes.NETEZZA,
  DbTypes.IMPALA,
  DbTypes.HIVE,
  DbTypes.BIGQUERY,
  DbTypes.SQLITE
];

export const defaultPorts = {
  [DbTypes.POSTGRESQL]: 5432,
  [DbTypes.SQL_SERVER]: 1433,
  [DbTypes.ORACLE]: 1521,
  [DbTypes.MYSQL]: 3306,
  [DbTypes.PDW]: 17001,
  [DbTypes.REDSHIFT]: 5439,
  [DbTypes.NETEZZA]: 5480
};
