import { MappingNode, MappingPair } from '../../models/mapping';

export interface ReportCreator {

  generateReport: () => any;

  createHeader: (text: string) => ReportCreator;

  createTablesMappingImage: (mappingPair: MappingPair) => ReportCreator;

  createDescriptionTable: (mapping: MappingNode[]) => ReportCreator;

  createParagraph: (text: string) => ReportCreator;
}
