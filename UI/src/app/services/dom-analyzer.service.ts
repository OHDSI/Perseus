import { IRow } from '../models/row';

export class DomAnalyzer {

  checkAndChangeHtmlElement(row: IRow): IRow {
    const foundElements = document.getElementsByClassName(`item-${row.tableName}-${row.name}`);
    const foundElement = this.extractHtmlElement(foundElements, null);

    if (foundElement) {
      row.htmlElement = foundElement;
    } else {
      const tableElements = document.getElementsByClassName(`panel-header-${row.tableName}`);
      row.htmlElement = this.extractHtmlElement(tableElements, row.htmlElement);
    }

    return row;
  }

  private extractHtmlElement(elements: any, defaultElement: any) {
    return elements.length > 0 ? elements[0] : defaultElement;
  }
}
