import { ReportCreator } from './report-creator';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Media,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';
import { MappingNode } from '@models/mapping';
import { createMappingFieldsImage, createMappingTablesImage } from './image/draw-image-util';
import { MappingForImage, MappingImage, MappingImageStyles } from './image/mapping-image';
import { logicForReport } from './logic-for-report';
import { IRow } from '@models/row';
import { commentsForReport } from './comments-for-report';
import { doubleQuote, singleQuote, sqlKeyWords } from './sql-keywords';
import { parseMappingNodesByGroups } from '@utils/mapping-util';

const paragraph = {
  spacing: {
    before: 120,
    after: 240
  }
};

export class WordReportCreator implements ReportCreator {
  document = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 32,
            bold: true
          },
          paragraph
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 28,
            bold: true
          },
          paragraph
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 24,
            bold: true
          },
          paragraph
        },
        {
          id: 'Heading4',
          name: 'Heading 4',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 24,
            bold: true
          },
          paragraph
        },
        {
          id: 'Default',
          name: 'Default',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 24
          },
          paragraph
        },
        {
          id: 'TableHeader',
          name: 'TableHeader',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 24,
            bold: true
          },
          paragraph
        }
      ]
    }
  });

  documentChildren = [];

  mappingPairImageStyles: MappingImageStyles = {
    width: 600,
    fieldWidth: 200,
    fieldHeight: 40,
    distanceBetweenSourceAndTarget: 186,
    marginLeft: 7,
    marginBottom: 4,
    textMarginTop: 14,
    fieldsMarginTop: 26,
    headerFont: '600 16px Times New Roman',
    fieldFont: '500 16px Times New Roman'
  };

  generateReport(): any {
    this.document.addSection({
      children: this.documentChildren
    });

    return this.document;
  }

  createHeader1(text: string): ReportCreator {
    return this.createHeader(text, HeadingLevel.HEADING_1, true);
  }

  createHeader2(text: string, onNewPage: boolean): ReportCreator {
    return this.createHeader(text, HeadingLevel.HEADING_2, onNewPage);
  }

  createHeader3(text: string, onNewPage: boolean): ReportCreator {
    return this.createHeader(text, HeadingLevel.HEADING_3, onNewPage);
  }

  createHeader4(text: string, onNewPage: boolean): ReportCreator {
    return this.createHeader(text, HeadingLevel.HEADING_4, onNewPage);
  }

  createTablesMappingImage(header: MappingForImage, mappingConfig: string[][]) {
    const imageForReport = createMappingTablesImage(header, mappingConfig, this.mappingPairImageStyles);
    return this.createImage(imageForReport);
  }

  createFieldsMappingImage(header: MappingForImage, mapping: MappingNode[]): ReportCreator {
    const imageForReport = createMappingFieldsImage(header, mapping, this.mappingPairImageStyles);
    return this.createImage(imageForReport);
  }

  createFieldsDescriptionTable(mappingNodes: MappingNode[]): ReportCreator {
    const header = createTableRow([
      createTableCell('Destination Field', 'TableHeader'),
      createTableCell('Source field', 'TableHeader'),
      createTableCell('Logic', 'TableHeader'),
      createTableCell('Comment field', 'TableHeader')
    ], true);

    const parsedMappingNodes = parseMappingNodesByGroups(mappingNodes);

    const rows = parsedMappingNodes
      .map(node => createTableRow([
        createTableCell(node.target_field),
        createTableCell(node.source_field),
        createTableCell(logicForReport(node), 'Default', true),
        createTableCell(commentsForReport(node.comments))
      ]));

    return this.createTable([
      header,
      ...rows
    ]);
  }

  createSourceInformationTable(rows: IRow[]): ReportCreator {
    const tableHeader = createTableRow([
      createTableCell('Field', 'TableHeader'),
      createTableCell('Type', 'TableHeader'),
      createTableCell('Comment', 'TableHeader')
    ], true);

    const tableRows = rows
      .map(row => createTableRow([
        createTableCell(row.name),
        createTableCell(row.type),
        createTableCell(commentsForReport(row.comments))
      ]));

    return this.createTable([
      tableHeader,
      ...tableRows
    ]);
  }

  createParagraph(text?: string): ReportCreator {
    this.documentChildren.push(new Paragraph({
      text: text ? text : '',
      style: 'Default'
    }));

    return this;
  }

  createTextBlock(text: string): ReportCreator {
    this.documentChildren.push(...mapTextToParagraphs(text));

    return this;
  }

  createSqlTextBlock(sql: string): ReportCreator {
    this.documentChildren.push(...mapSqlTextToParagraphs(sql));

    return this;
  }

  private createHeader(text: string, heading: HeadingLevel, pageBreakBefore: boolean): ReportCreator {
    this.documentChildren.push(new Paragraph({
      text,
      heading,
      pageBreakBefore
    }));

    return this;
  }

  private createImage(imageForReport: MappingImage): ReportCreator {
    const size = imageForReport.width < 600 ?
      {width: imageForReport.width, height: imageForReport.height} :
      {width: 600, height: imageForReport.height * 600 / imageForReport.width};

    const image = Media.addImage(
      this.document,
      imageForReport.base64,
      size.width,
      size.height
    );

    this.documentChildren.push(new Paragraph(image));

    return this;
  }

  private createTable(rows: TableRow[]): ReportCreator {
    this.documentChildren.push(new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      margins: {
        left: 100
      },
      alignment: AlignmentType.CENTER,
    }));

    return this;
  }
}

function createTableRow(cells: TableCell[], isHeader = false): TableRow {
  return new TableRow({
    children: cells,
    tableHeader: isHeader
  });
}

function createTableCell(text: string, style = 'Default', sql = false): TableCell {
  return new TableCell({
    children: sql ? mapSqlTextToParagraphs(text, style) : mapTextToParagraphs(text, style)
  });
}

function mapTextToParagraphs(content: string, style = 'Default'): Paragraph[] {
  return content
    .split('\n')
    .map(text => new Paragraph({
      text,
      style
    }));
}

function mapSqlTextToParagraphs(sql: string, style = 'Default'): Paragraph[] {
  const textRun = (text: string, wasQuote: boolean) => !wasQuote && sqlKeyWords.includes(text.trim().toLowerCase()) ?
    new TextRun({text, color: '#066BBB'}) :
    new TextRun({text});

  const hasQuote = (word: string, quote: string) =>
    word === quote || word.startsWith(quote) || word.endsWith(quote);

  return sql
    .split('\n')
    .map(line => {
      let wasSingleQuote = false;
      let wasDoubleQuote = false;

      return new Paragraph({
        children: line
          .split(/( )/g)
          .map(word => {
            if (hasQuote(word, singleQuote)) {
              wasSingleQuote = !wasSingleQuote;
            }
            if (hasQuote(word, doubleQuote)) {
              wasDoubleQuote = !wasDoubleQuote;
            }

            return textRun(word, wasSingleQuote || wasDoubleQuote);
          }),
        style
      });
    });
}

