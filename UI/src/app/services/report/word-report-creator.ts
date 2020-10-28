import { ReportCreator } from './report-creator';
import { Document, Paragraph, Media, TableRow, TableCell, Table } from 'docx';
import { MappingNode, MappingPair } from '../../models/mapping';
import { createMappingPairImage } from './image/draw-image-util';

export class WordReportCreator implements ReportCreator {
  document = new Document();
  documentChildren = [];

  generateReport(): any {
    this.document.addSection({
      children: this.documentChildren
    });

    return this.document;
  }

  createHeader(text: string): ReportCreator {
    this.documentChildren.push(new Paragraph(text));

    return this;
  }

  createTablesMappingImage(mappingPair: MappingPair): ReportCreator {
    const imageForReport = createMappingPairImage(mappingPair);
    const image = Media.addImage(
      this.document,
      imageForReport.content,
      imageForReport.width,
      imageForReport.height
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
      ]
    }));

    return this;
  }

  createParagraph(text = ''): ReportCreator {
    this.documentChildren.push(new Paragraph(text));

    return this;
  }
}

function createTableCell(text: string): TableCell {
  return new TableCell({children: [new Paragraph(text)]});
}

function getLogic(mappingNode: MappingNode): string {
  return '';
}

