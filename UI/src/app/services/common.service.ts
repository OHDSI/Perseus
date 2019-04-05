import { Injectable } from '@angular/core';

export interface Row {
    area: string;
    table: any;
    row: string;
}

@Injectable()
export class CommonService {
  private _activeRow: Row;
  private _sourceAreaWidth: number;
  private _targetAreaWidth: number;

  constructor() {}

  set activeRow(row: Row) {
      this._activeRow = row;
  }
  get activeRow() {
      return this._activeRow;
  }

  get sourceAreaWidth() {
    return this._sourceAreaWidth;
  }
  get targetAreaWidth() {
    return this._targetAreaWidth;
  }

  setAreaWidth(area: string, width: number) {
    this[`_${area}AreaWidth`] = width;
  }

}