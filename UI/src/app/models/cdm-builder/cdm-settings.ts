import { TableSettings } from "../table";

export interface CdmSettings {
  sourceEngine?: string;
  sourceServer?: string;
  sourcePort?: number;
  sourceDatabase?: string;
  sourceSchema?: string;
  sourceUser?: string;
  sourceHttppath?: string;
  sourcePassword?: string;

  destinationEngine: string;
  destinationServer: string;
  destinationPort: number;
  destinationDatabase: string;
  destinationSchema: string;
  destinationUser: string;
  destinationHttppath?: string;
  destinationPassword: string;

  mappingsName: string;
  cdmVersion: string;

  conversionId?: number;
  tableSettings?: ITableSettingsCdm[];
}

export interface ITableSettingsCdm {
  tableName: string;
  settings: TableSettings;
}

export interface SourceCdmSettings {
  sourceEngine?: string;
  sourceServer?: string;
  sourcePort?: number;
  sourceDatabase?: string;
  sourceSchema?: string;
  sourceUser?: string;
  sourceHttppath?: string;
  sourcePassword?: string;
}

export interface TargetCdmSettings {
  destinationEngine: string;
  destinationServer: string;
  destinationPort: number;
  destinationDatabase: string;
  destinationSchema: string;
  destinationUser: string;
  destinationHttppath?: string;
  destinationPassword: string;
}
