import { Injectable, ElementRef } from '@angular/core';
import { Area } from '../models/area';

@Injectable()
export class CommonService {
  svgCanvas: ElementRef;
  mainElement: ElementRef;
  mappingElement: ElementRef;

  private areaWidth = {};

  constructor() {}

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
    this.mainElement = main;
  }
}
