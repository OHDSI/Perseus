export interface CdmSettings {
  sourceEngine?: string;
  sourceServer?: string;
  sourcePort?: number;
  sourceDatabase?: string;
  sourceSchema?: string;
  sourceUser?: string;
  sourcePassword?: string;

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

export interface SourceCdmSettings {
  sourceEngine?: string;
  sourceServer?: string;
  sourcePort?: number;
  sourceDatabase?: string;
  sourceSchema?: string;
  sourceUser?: string;
  sourcePassword?: string;
}

export interface TargetCdmSettings {
  destinationEngine: string;
  destinationServer: string;
  destinationPort: number;
  destinationDatabase: string;
  destinationSchema: string;
  destinationUser: string;
  destinationPassword: string;
}
