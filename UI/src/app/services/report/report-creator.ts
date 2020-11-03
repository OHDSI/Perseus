import { MappingNode } from '../../models/mapping';
import { MappingForImage } from './image/mapping-image';
import { IRow } from '../../models/row';

export interface ReportCreator {

  generateReport: () => any;

  createHeader1: (text: string) => ReportCreator;

  createHeader2: (text: string, onNewPage: boolean) => ReportCreator;

  createHeader3: (text: string, onNewPage: boolean) => ReportCreator;

  createTablesMappingImage: (header: MappingForImage, mappingConfig: string[][]) => ReportCreator;

  createFieldsMappingImage: (header: MappingForImage, mapping: MappingNode[]) => ReportCreator;

  createDescriptionTable: (mapping: MappingNode[]) => ReportCreator;

  createSourceInformationTable: (rows: IRow[]) => ReportCreator;

  createParagraph: (text?: string) => ReportCreator;

  createTextBlock: (text: string) => ReportCreator;

  createSqlTextBlock: (sql: string) => ReportCreator;
}
