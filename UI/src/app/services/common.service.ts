import { Injectable, ElementRef } from '@angular/core';
import { Area } from '../models/area';

@Injectable()
export class CommonService {
  svgCanvas: ElementRef;
  mainCanvas: ElementRef;

  private areaWidth = {};

  private sourceexpanded = false;
  private targetexpanded = false;

  constructor() {}

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

  // get hintStatus() {
  //   if (this._linked) {
  //     return '';
  //   } else if (this.sourceexpanded && this.targetexpanded) {
  //     return 'Drag and drop source item to target item';
  //   } else {
  //     return 'Expand tables to make links';
  //   }
  // }

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
