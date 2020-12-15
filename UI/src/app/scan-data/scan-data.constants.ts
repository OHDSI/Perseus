import { whiteRabbitPrefix, whiteRabbitUrl } from '../app.constants';

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

export const whiteRabbitWebSocketConfig = {
  url: whiteRabbitUrl,
  prefix: whiteRabbitPrefix,
  progressMessagesDestination: '/user/queue/reply',
};
