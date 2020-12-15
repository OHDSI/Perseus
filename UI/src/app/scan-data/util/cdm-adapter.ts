import { DbSettings } from '../model/db-settings';

/* Adapt white-rabbit dbSettings to CDM-builder settings */

const dbTypeIdentifiers = {
  postgre: name => name === 'PostgreSQL',
  mssql: name => name === 'SQL Server',
  mysql: name => name === 'MySQL',
};

export function adaptDbSettingsForSource(dbSettings: DbSettings) {
  const sourceEngine = Object.keys(dbTypeIdentifiers)
    .find(key => dbTypeIdentifiers[key](dbSettings.dbType));

  return {
    sourceEngine,
    sourceServer: dbSettings.server,
    sourceSchema: dbSettings.schemaName,
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
    destinationSchema: dbSettings.schemaName,
    destinationDatabase: dbSettings.database,
    destinationUser: dbSettings.user,
    destinationPassword: dbSettings.password
  };
}
