import { DbSettings } from '../model/db-settings';
import { CdmSettings } from '../model/cdm-settings';

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

export function adaptDbSettingsForSource(dbSettings: DbSettings) {
  const sourceEngine = Object.keys(dbTypeIdentifiers)
    .find(key => dbTypeIdentifiers[key] === dbSettings.dbType);

  return {
    sourceEngine,
    sourceServer: dbSettings.server,
    sourceSchema: dbSettings.schema,
    sourceDatabase: dbSettings.database,
    sourceUser: dbSettings.user,
    sourcePassword: dbSettings.password
  };
}

export function adaptDbSettingsForDestination(dbSettings: DbSettings) {
  const destinationEngine = Object.keys(dbTypeIdentifiers)
    .find(key => dbTypeIdentifiers[key] === dbSettings.dbType);

  return {
    destinationEngine,
    destinationServer: dbSettings.server,
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
    port: null,
    database: cdmSettings.destinationDatabase,
    schema: cdmSettings.destinationSchema,
    user: cdmSettings.destinationUser,
    password: cdmSettings.destinationPassword
  };
}

