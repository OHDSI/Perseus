import { IRow } from '@models/row';
import { extractHtmlElement } from '@utils/html-utilities';

export function parseArrowKey(key) {
  const ids = key.split('/');
  const sourceTableRowIds = ids[0];
  const targetTableRowIds = ids[1];

  return {
    ids: key.split('/'),
    sourceTableRowIds: ids[0],
    targetTableRowIds: ids[1],
    sourceTableId: sourceTableRowIds.split('-')[0],
    targetTableId: targetTableRowIds.split('-')[0]
  };
}

export function checkAndChangeHtmlElement(row: IRow): IRow {
  const foundElements = document.getElementsByClassName(
    `item-${row.area}-${row.tableName}-${row.cloneTableName ? row.cloneTableName : ''}-${row.cloneConnectedToSourceName ? row.cloneConnectedToSourceName : ''}-${row.name}`
  );
  const foundElement = extractHtmlElement(foundElements, null);

  if (foundElement) {
    row.htmlElement = foundElement;
  } else {
    const tableElements = document.getElementsByClassName(
      `panel-header-${row.tableName}`
    );
    row.htmlElement = extractHtmlElement(tableElements, row.htmlElement);
  }

  return row;
}

export function generateSvgPath(pointStart: number[], pointEnd: number[]): string {
  const x1 = pointStart[0];
  const y1 = pointStart[1];
  const x2 = pointEnd[0];
  const y2 = pointEnd[1];

  // M173,475 C326,467 137,69 265,33
  return `M${x1},${y1} C${x1 + 200},${y1} ${x2 - 200},${y2} ${x2},${y2}`;
}
