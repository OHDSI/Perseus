import { MappingNode } from '../../models/mapping';
import { MappingForImage } from './image/mapping-image';

export interface ReportCreator {

  generateReport: () => any;

  createHeader1: (text: string) => ReportCreator;

  createHeader2: (text: string) => ReportCreator;

  createHeader3: (text: string) => ReportCreator;

  createTablesMappingImage: (header: MappingForImage, mappingConfig: string[][]) => ReportCreator;

  createFieldsMappingImage: (header: MappingForImage, mapping: MappingNode[]) => ReportCreator;

  createDescriptionTable: (mapping: MappingNode[]) => ReportCreator;

  createParagraph: (text: string) => ReportCreator;
}
