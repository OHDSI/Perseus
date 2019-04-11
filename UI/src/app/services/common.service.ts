import { Injectable } from '@angular/core';
import { IRow } from '../components/pages/mapping/mapping.component';

@Injectable()
export class CommonService {
  private _activeRow: IRow;
  private _sourceAreaWidth: number;
  private _targetAreaWidth: number;

  constructor() {}

  set activeRow(row: IRow) {
      this._activeRow = row;
  }
  get activeRow(): IRow {
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