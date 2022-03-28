export interface CdmSettings {
  vocabularyEngine: string;
  vocabularyServer: string;
  vocabularyPort: number;
  vocabularyDatabase: string;
  vocabularySchema: string;
  vocabularyUser: string;
  vocabularyPassword: string;

  sourceEngine: string;
  sourceServer: string;
  sourcePort: number;
  sourceDatabase: string;
  sourceSchema: string;
  sourceUser: string;
  sourcePassword: string;

  destinationEngine: string;
  destinationServer: string;
  destinationPort: number;
  destinationDatabase: string;
  destinationSchema: string;
  destinationUser: string;
  destinationPassword: string;

  mappingsName: string;
  cdmVersion: string;

  conversionId?: number
}
