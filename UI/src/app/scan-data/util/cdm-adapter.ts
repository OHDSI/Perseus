import { DbSettings } from '../model/db-settings';

/* Adapt white-rabbit dbSettings to CDM-builder settings */

const dbTypeIdentifiers = {
  Postgre: name => name === 'PostgreSQL',
  MSSQL: name => name === 'SQL Server',
  Mysql: name => name === 'MySQL'
};

const cdmVersionIdentifiers = {
  'v6.0': name => name === '6',
  'v5.3': name => name === '5.3.0'
};

export function adaptDbSettingsForSource(dbSettings: DbSettings) {
  const sourceEngine = Object.keys(dbTypeIdentifiers)
    .find(key => dbTypeIdentifiers[key](dbSettings.dbType));

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
    .find(key => dbTypeIdentifiers[key](dbSettings.dbType));

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
  return Object.keys(cdmVersionIdentifiers)
    .find(key => cdmVersionIdentifiers[key](version));
}
