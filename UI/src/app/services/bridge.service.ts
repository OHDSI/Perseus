import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';

@Injectable()
export class BridgeService {
  private _sourceRow: IRow;
  private _targetRow: IRow;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private commonService: CommonService,
    private drawService: DrawService
  ) { }

  set sourceRow(row: IRow) {
    this._sourceRow = row;
  }
  get sourceRow() {
    return this._sourceRow;
  }

  set targetRow(row: IRow) {
    this._targetRow = row;
  }
  get targetRow() {
    return this._targetRow;
  }

  connect() {
    this.drawService.drawLine(this.sourceRow, this.targetRow);
    this.commonService.linked = true;
  }
}