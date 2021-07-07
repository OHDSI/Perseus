import { DbSettings } from '../models/scan-data/db-settings';
import { CdmSettings } from '../models/scan-data/cdm-settings';

/* Adapt white-rabbit dbSettings to CDM-builder settings */
const dbTypeIdentifiers = {
  Postgre: 'PostgreSQL',
  MSSQL: 'SQL Server',
  Mysql: 'MySQL'
};

/* Adapt cdm version*/
const cdmVersionIdentifiers = {
  'v6.0': name => name === '6',
  'v5.3': name => name === '5.3.0'
};

export function adaptDbType(dbType) {
  return Object.keys(dbTypeIdentifiers)
    .find(key => dbTypeIdentifiers[key] === dbType);
}

export function adaptDbSettingsForSource(dbSettings: DbSettings) {
  const sourceEngine = adaptDbType(dbSettings.dbType);

  return {
    sourceEngine,
    sourceServer: dbSettings.server,
    sourcePort: dbSettings.port,
    sourceSchema: dbSettings.schema,
    sourceDatabase: dbSettings.database,
    sourceUser: dbSettings.user,
    sourcePassword: dbSettings.password
  };
}

export function adaptDbSettingsForDestination(dbSettings: DbSettings) {
  const destinationEngine = adaptDbType(dbSettings.dbType);

  return {
    destinationEngine,
    destinationServer: dbSettings.server,
    destinationPort: dbSettings.port,
    destinationSchema: dbSettings.schema,
    destinationDatabase: dbSettings.database,
    destinationUser: dbSettings.user,
    destinationPassword: dbSettings.password
  };
}

export function adaptCdmVersions(version: string) {
  const result = Object.keys(cdmVersionIdentifiers)
    .find(key => cdmVersionIdentifiers[key](version));

  return result ? result : version;
}

export function adaptDestinationCdmSettings(cdmSettings: CdmSettings): DbSettings {
  const dbType = dbTypeIdentifiers[cdmSettings.destinationEngine];

  return {
    dbType,
    server: cdmSettings.destinationServer,
    port: cdmSettings.destinationPort,
    database: cdmSettings.destinationDatabase,
    schema: cdmSettings.destinationSchema,
    user: cdmSettings.destinationUser,
    password: cdmSettings.destinationPassword
  };
}

