import { ReportCreator } from './report-creator';
import { AlignmentType, Document, HeadingLevel, Media, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { MappingNode } from '../../models/mapping';
import { createMappingFieldsImage, createMappingTablesImage } from './image/draw-image-util';
import { MappingImage, MappingForImage, MappingImageStyles } from './image/mapping-image';
import { logicForReport } from './logic-for-report';
import { IRow } from '../../models/row';
import { commentsForReport } from './comments-for-report';
import { sqlKeyWord } from './sql-key-words';

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
    headerFont: '600 16px Akzidenz-Grotesk Pro',
    fieldFont: '500 16px Akzidenz-Grotesk Pro'
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

  createTablesMappingImage(header: MappingForImage, mappingConfig: string[][]) {
    const imageForReport = createMappingTablesImage(header, mappingConfig, this.mappingPairImageStyles);
    return this.createImage(imageForReport);
  }

  createFieldsMappingImage(header: MappingForImage, mapping: MappingNode[]): ReportCreator {
    const imageForReport = createMappingFieldsImage(header, mapping, this.mappingPairImageStyles);
    return this.createImage(imageForReport);
  }

  createDescriptionTable(mapping: MappingNode[]): ReportCreator {
    const header = getTableRow([
      getTableCell('Destination Field', 'TableHeader'),
      getTableCell('Source field', 'TableHeader'),
      getTableCell('Logic', 'TableHeader'),
      getTableCell('Comment field', 'TableHeader')
    ], true);

    const rows = mapping
      .map(node => getTableRow([
        getTableCell(node.target_field),
        getTableCell(node.source_field),
        getTableCell(logicForReport(node), 'Default', true),
        getTableCell(commentsForReport(node.comments))
      ]));

    return this.createTable([
      header,
      ...rows
    ]);
  }

  createSourceInformationTable(rows: IRow[]): ReportCreator {
    const tableHeader = getTableRow([
      getTableCell('Field', 'TableHeader'),
      getTableCell('Type', 'TableHeader'),
      getTableCell('Comment', 'TableHeader')
    ], true);

    const tableRows = rows
      .map(row => getTableRow([
        getTableCell(row.name),
        getTableCell(row.type),
        getTableCell(commentsForReport(row.comments))
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

function getTableRow(cells: TableCell[], isHeader = false): TableRow {
  return new TableRow({
    children: cells,
    tableHeader: isHeader
  });
}

function getTableCell(text: string, style = 'Default', sql = false): TableCell {
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
  const keyWords = sqlKeyWord();

  const textRun = (text: string) => keyWords.includes(text) ?
    new TextRun({text, color: '#066BBB'}) :
    new TextRun({text});

  return sql
    .split('\n')
    .map(line => new Paragraph({
        children: line
          .split(/( )/g)
          .map(word => textRun(word)),
        style
      })
    );
}

