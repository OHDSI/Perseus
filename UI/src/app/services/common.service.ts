import { Injectable } from '@angular/core';

import { IRow } from 'src/app/models/row';
import { IConnector } from 'src/app/models/connector';
import { Area } from 'src/app/components/area/area.component';

@Injectable()
export class CommonService {
  private _activeRow: IRow = null;
  private _activeConnector: IConnector = null;
  private _sourceAreaWidth: number;
  private _targetAreaWidth: number;

  private _sourceExpanded = false;
  private _targetExpanded = false;
  private _linked = false;

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

  set activeConnector(connector: IConnector) {
    this._activeConnector = connector;
  }
  get activeConnector() {
    return this._activeConnector;
  }

  expanded(area: Area) {
    switch (area) {
      case 'source': {
        this._sourceExpanded = true;
        break;
      }
      case 'target': {
        this._targetExpanded = true;
        break;
      }
    }
  }
  collapsed(area: Area) {
    switch (area) {
      case 'source': {
        this._sourceExpanded = false;
        break;
      }
      case 'target': {
        this._targetExpanded = false;
        break;
      }
    }
  }
  set linked(status: boolean) {
    this._linked = status;
  }

  get hintStatus() {
    if (this._linked) {
      return '';
    } else if (this._sourceExpanded && this._targetExpanded) {
      return 'Drag and drop source item to target item';
    } else {
      return 'Expand tables to make links';
    }
  }

  setAreaWidth(area: string, width: number) {
    this[`_${area}AreaWidth`] = width;
  }

}