import { Injectable } from '@angular/core';

export interface Row {
    area: string;
    table: string;
    row: string;
}

@Injectable()
export class CommonService {
  private _activeRow: Row;

  constructor() {}

  set activeRow(row: Row) {
      this._activeRow = row;
  }
  get activeRow() {
      return this._activeRow;
  }

}