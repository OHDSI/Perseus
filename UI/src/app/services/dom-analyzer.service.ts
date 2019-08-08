import { IRow } from '../models/row';

export class DomAnalyzer {

  checkAndChangeHtmlElement(row: IRow): IRow {
    const foundElement = document.getElementById(row.name);
    if (foundElement) {
      row.htmlElement = foundElement;
    } else {
      const tableElement = document.getElementsByClassName(`panel-header-${row.tableName}`);
      row.htmlElement =  tableElement.length > 0 ? tableElement[0] : row.htmlElement;
    }

    return row;
  }
}
