import { cdmBuilderLogUrl, whiteRabbitPrefix, whiteRabbitUrl } from '../app.constants';
import { DbSettings } from './model/db-settings';

/* Name uses in UI and White Rabbit */
enum DbTypes {
  MYSQL = 'MySQL',
  ORACLE = 'Oracle',
  POSTGRESQL = 'PostgreSQL',
  REDSHIFT = 'Redshift',
  SQL_SERVER = 'SQL Server',
  AZURE = 'Azure',
  MS_ACCESS = 'MS Access',
  TERADATA = 'Teradata',
  BIGQUERY = 'BigQuery'
}

/* Name uses in UI and White Rabbit */
enum FileTypes {
  CSV = 'CSV files'
}

export const whiteRabbitDatabaseTypes = [
  DbTypes.MYSQL,
  DbTypes.ORACLE,
  DbTypes.POSTGRESQL,
  DbTypes.REDSHIFT,
  DbTypes.SQL_SERVER,
  DbTypes.AZURE,
  DbTypes.MS_ACCESS,
  DbTypes.TERADATA,
  DbTypes.BIGQUERY
];

export const dbTypesRequireSchema = [
  DbTypes.ORACLE,
  DbTypes.POSTGRESQL
];

export const delimitedFiles = [
  FileTypes.CSV
];

export const cdmBuilderDatabaseTypes = [
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
  vocabularyEngine: 'MSSQL', // Name for Cdm builder
  vocabularyServer: '822JNJ16S03V',
  vocabularySchema: 'dbo',
  vocabularyDatabase: 'Vocabulary_20190617',
  vocabularyUser: '3dx_reader',
  vocabularyPassword: 'xd3!Ypr7q',
  mappingsName: 'TestMappings'
};

export const uniformSamplingTooltipText = 'For all fields, choose every possible value with the same probability';

export const fakeDataDbSettings: DbSettings = {
  dbType: DbTypes.ORACLE,
  server: '10.110.1.7',
  database: 'testdb',
  user: 'postgres',
  password: 'postgres',
  schema: 'testdb'
};
