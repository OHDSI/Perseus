import { Injectable } from '@angular/core';

@Injectable()
export class DragService {
  private _dataTransfer = null;
  private _sourceTitle: string = null;
  private _targetTitle: string = null;

  constructor() { }

  set data(data) {
    this._dataTransfer = data;
  }
  get data() {
    return this._dataTransfer;
  }

  set sourceTitle(tableTitle: string) {
    this._sourceTitle = tableTitle;
  }
  get sourceTitle() {
    return this._sourceTitle;
  }

  set targetTitle(tableTitle: string) {
    this._targetTitle = tableTitle;
  }
  get targetTitle() {
    return this._targetTitle;
  }

  sourceEqualsTarget() {
    return this._sourceTitle === this._targetTitle;
  }

}
