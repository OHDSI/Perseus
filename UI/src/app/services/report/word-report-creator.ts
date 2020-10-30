import { ReportCreator } from './report-creator';
import { AlignmentType, Document, HeadingLevel, Media, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { MappingNode, MappingPair } from '../../models/mapping';
import { createMappingFieldsImage, createMappingTablesImage } from './image/draw-image-util';
import { MappingImage, MappingForImage, MappingImageStyles } from './image/mapping-image';
import { logic } from './logic';

const paragraph = {
  spacing: {
    before: 120,
    after: 120
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
    return this.createHeader(text, HeadingLevel.HEADING_1);
  }

  createHeader2(text: string): ReportCreator {
    return this.createHeader(text, HeadingLevel.HEADING_2);
  }

  createHeader3(text: string): ReportCreator {
    return this.createHeader(text, HeadingLevel.HEADING_3);
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
    const header = createTableRow([
      createTableCell('Destination Field', 'TableHeader'),
      createTableCell('Source field', 'TableHeader'),
      createTableCell('Logic', 'TableHeader'),
      createTableCell('Comment field', 'TableHeader')
    ], true);

    const rows = mapping
      .map(node => createTableRow([
        createTableCell(node.target_field),
        createTableCell(node.source_field),
        createTableCell(logic(node)),
        createTableCell(node.comments
          .map(c => c.text)
          .join('\n')
        )
      ]));

    this.documentChildren.push(new Table({
      rows: [
        header,
        ...rows
      ],
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

  createParagraph(text = ''): ReportCreator {
    this.documentChildren.push(new Paragraph({
      text,
      style: 'Default'
    }));

    return this;
  }

  private createHeader(text: string, heading: HeadingLevel) {
    this.documentChildren.push(new Paragraph({
      text,
      heading,
      pageBreakBefore: true
    }));

    return this;
  }

  private createImage(imageForReport: MappingImage) {
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
}

function createTableRow(cells: TableCell[], isHeader = false) {
  return new TableRow({
    children: cells,
    tableHeader: isHeader
  });
}

function createTableCell(text: string, style = 'Default'): TableCell {
  return new TableCell({
    children: [new Paragraph({
      text,
      style
    })]
  });
}

