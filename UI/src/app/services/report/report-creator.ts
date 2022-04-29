import { MappingNode } from '@models/etl-mapping-for-zip-xml-generation';
import { MappingForImage } from './image/mapping-image';
import { IRow } from '@models/row';

export interface ReportCreator {

  generateReport: () => any;

  createHeader1: (text: string) => ReportCreator;

  createHeader2: (text: string, onNewPage: boolean) => ReportCreator;

  createHeader3: (text: string, onNewPage: boolean) => ReportCreator;

  createHeader4: (text: string, onNewPage: boolean) => ReportCreator;

  createTablesMappingImage: (header: MappingForImage, mappingConfig: string[][]) => ReportCreator;

  createFieldsMappingImage: (header: MappingForImage, mapping: MappingNode[]) => ReportCreator;

  createFieldsDescriptionTable: (mapping: MappingNode[]) => ReportCreator;

  createSourceInformationTable: (rows: IRow[]) => ReportCreator;

  createParagraph: (text?: string) => ReportCreator;

  createTextBlock: (text: string) => ReportCreator;

  createSqlTextBlock: (sql: string) => ReportCreator;
}
