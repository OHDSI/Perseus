import { dbServer } from '../app.constants';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { adaptDbType } from '@utils/cdm-adapter';

/* Name uses in UI and White Rabbit */
export enum DbTypes {
  MYSQL = 'MySQL',
  SQL_SERVER = 'SQL Server',
  POSTGRESQL = 'PostgreSQL',
  ORACLE = 'Oracle',
  AZURE = 'Azure',
  REDSHIFT = 'Redshift',
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
  DbTypes.SQL_SERVER,
  DbTypes.POSTGRESQL,
  DbTypes.ORACLE,
  DbTypes.REDSHIFT,
  DbTypes.AZURE,
  DbTypes.MS_ACCESS,
  DbTypes.TERADATA,
  DbTypes.BIGQUERY
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

export const dictionaryDbSettingForCdmBuilder = {
  vocabularyEngine: adaptDbType(DbTypes.POSTGRESQL),
  vocabularyServer: dbServer,
  vocabularyPort: 5431,
  vocabularyDatabase: 'cdm_souffleur',
  vocabularySchema: 'vocabulary',
  vocabularyUser: 'cdm_builder',
  vocabularyPassword: 'N7jscuS3ca'
};

export const uniformSamplingTooltipText = 'For all fields, choose every possible value with the same probability';

export const fakeDataDbSettings: DbSettings = {
  dbType: DbTypes.POSTGRESQL,
  server: dbServer,
  database: 'cdm_souffleur',
  user: 'postgres',
  password: '5eC_DkMr^3',
  port: 5431
};

export const dqdDatabaseTypes = [
  DbTypes.SQL_SERVER,
  DbTypes.POSTGRESQL,
  DbTypes.ORACLE,
  DbTypes.REDSHIFT,
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

export const fullySupportedDatabases: string[] = [
  DbTypes.POSTGRESQL,
  DbTypes.SQL_SERVER,
  DbTypes.MYSQL
]

export const supportedWithLimitationsDatabases: string[] = [
  DbTypes.ORACLE,
  DbTypes.REDSHIFT,
  DbTypes.AZURE,
  DbTypes.MS_ACCESS,
  DbTypes.TERADATA,
  DbTypes.BIGQUERY
]

export const dbTypeWithLimits = {
  [DbTypes.MYSQL]: 'CTE not supported prior to v8'
}
