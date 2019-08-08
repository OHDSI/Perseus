import { IRow } from '../models/row';

export class DomAnalyzer {

  checkAndChangeHtmlElement(row: IRow): IRow {
    const foundElement = document.getElementById(row.name);
    if (foundElement) {
      row.htmlElement = foundElement;
    } else {
      const tableElement = document.getElementById(row.tableName);
      row.htmlElement =  tableElement || row.htmlElement;
    }

    return row;
  }
}
