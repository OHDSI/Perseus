export interface CdmSettings {
  sourceEngine: string;
  destinationEngine: string;
  vocabularyEngine: string;

  sourceServer: string;
  destinationServer: string;
  vocabularyServer: string;

  sourceSchema: string;
  destinationSchema: string;
  vocabularySchema: string;

  sourceDatabase: string;
  destinationDatabase: string;
  vocabularyDatabase: string;

  sourceUser: string;
  destinationUser: string;
  vocabularyUser: string;

  sourcePassword: string;
  destinationPassword: string;
  vocabularyPassword: string;

  mappingsName: string;
  cdmVersion: string;
}
