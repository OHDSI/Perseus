import { Injectable, ElementRef } from '@angular/core';

import { IRow } from 'src/app/models/row';
import { Area } from '../models/area';
import { IConnector } from '../models/interface/connector.interface';

@Injectable()
export class CommonService {
  svgCanvas: ElementRef;
  mainCanvas: ElementRef;

  private areaWidth = {};

  private activerow: IRow = null;
  private activeconnector: IConnector = null;

  private sourceexpanded = false;
  private targetexpanded = false;

  private _linked = false;

  constructor() {}

  set activeRow(row: IRow) {
    this.activerow = row;
  }
  get activeRow(): IRow {
    return this.activerow;
  }

  set activeConnector(connector: IConnector) {
    this.activeconnector = connector;
  }
  get activeConnector() {
    return this.activeconnector;
  }

  expanded(area: Area) {
    switch (area) {
      case 'source': {
        this.sourceexpanded = true;
        break;
      }
      case 'target': {
        this.targetexpanded = true;
        break;
      }
    }
  }

  collapsed(area: Area) {
    switch (area) {
      case 'source': {
        this.sourceexpanded = false;
        break;
      }
      case 'target': {
        this.targetexpanded = false;
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
    } else if (this.sourceexpanded && this.targetexpanded) {
      return 'Drag and drop source item to target item';
    } else {
      return 'Expand tables to make links';
    }
  }

  setAreaWidth(area: string, width: number) {
    this.areaWidth[area] = width;
  }

  getAreaWidth(area: string) {
    return this.areaWidth[area];
  }

  setSvg(svg: ElementRef) {
    this.svgCanvas = svg;
  }

  setMain(main: ElementRef) {
    this.mainCanvas = main;
  }
}
