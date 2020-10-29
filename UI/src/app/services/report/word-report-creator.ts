import { ReportCreator } from './report-creator';
import { Document, Paragraph, Media, TableRow, TableCell, Table, HeadingLevel, WidthType } from 'docx';
import { MappingNode, MappingPair } from '../../models/mapping';
import { createMappingPairImage } from './image/draw-image-util';
import { MappingPairImageStyles } from './image/mapping-pair-image';

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
            size: 28,
            bold: true,
          }
        },
        {
          id: '',
          name: 'Default',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 24
          }
        }
      ]
    }
  });
  documentChildren = [];

  mappingPairImageStyles: MappingPairImageStyles = {
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

  createHeader(text: string): ReportCreator {
    this.documentChildren.push(new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
    }));

    return this;
  }

  createTablesMappingImage(mappingPair: MappingPair): ReportCreator {
    const imageForReport = createMappingPairImage(mappingPair, this.mappingPairImageStyles);

    const size = imageForReport.width < 600 ?
      {width: imageForReport.width, height: imageForReport.height} :
      {width: 600, height: imageForReport.height * 600 / imageForReport.width};

    const image = Media.addImage(
      this.document,
      imageForReport.content,
      size.width,
      size.height
    );

    this.documentChildren.push(new Paragraph(image));

    return this;
  }

  createDescriptionTable(mapping: MappingNode[]): ReportCreator {
    const header = new TableRow({
      children: [
        createTableCell('Destination Field'),
        createTableCell('Source field'),
        createTableCell('Logic'),
        createTableCell('Comment field')
      ]
    });

    const rows = mapping
      .map(node => new TableRow({
        children: [
          createTableCell(node.target_field),
          createTableCell(node.source_field),
          createTableCell(getLogic(node)),
          createTableCell(node.comments.join('\n'))
        ]
      }));

    this.documentChildren.push(new Table({
      rows: [
        header,
        ...rows
      ],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      }
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
}

function createTableCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({
      text,
      style: 'Default'
    })]
  });
}

function getLogic(mappingNode: MappingNode): string {
  return '';
}

