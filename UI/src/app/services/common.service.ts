import { Injectable } from '@angular/core';

export interface Row {
    area: string;
    table: string;
    row: string;
}

@Injectable()
export class CommonService {
  private _activeRow: Row;

  sourceAreaWidth: number;
  targetAreaWidth: number;

  constructor() {}

  set activeRow(row: Row) {
      this._activeRow = row;
  }
  get activeRow() {
      return this._activeRow;
  }

  setAreaWidth(area: string, width: number) {
    this[`${area}AreaWidth`] = width;
  }

}