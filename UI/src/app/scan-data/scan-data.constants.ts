import { cdmBuilderLogUrl, whiteRabbitPrefix, whiteRabbitUrl } from '../app.constants';

export const whiteRabbitDatabaseTypes = [
  'MySQL',
  'Oracle',
  'PostgreSQL',
  'Redshift',
  'SQL Server',
  'Azure',
  'MS Access',
  'Teradata',
  'BigQuery'
];

export const delimitedFiles = [
  'CSV files'
];

export const cdmBuilderDatabaseTypes = [
  'PostgreSQL',
  'SQL Server',
  'MySQL'
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
  vocabularyEngine: 'MSSQL',
  vocabularyServer: '822JNJ16S03V',
  vocabularySchema: 'dbo',
  vocabularyDatabase: 'Vocabulary_20190617',
  vocabularyUser: '3dx_reader',
  vocabularyPassword: 'xd3!Ypr7q',
  mappingsName: 'TestMappings'
};
