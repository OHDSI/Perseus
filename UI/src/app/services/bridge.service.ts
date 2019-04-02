import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BridgeButtonComponent } from 'src/app/components/bridge-button/bridge-button.component';
import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';

@Injectable()
export class BridgeService {
  private _source;
  private _target;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private commonService: CommonService,
    private drawService: DrawService
  ) { }

  set source(row: any) {
    this._source = row;
  }
  get source() {
    return this._source;
  }

  set target(row: any) {
    this._target = row;
  }
  get target() {
    return this._target;
  }

  connect() {
    const line = this.drawService.drawLine(this.source, this.target);
    this._appendButton(line);
  }

  private _appendButton(line) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(BridgeButtonComponent)
      .create(this.injector);

    this.appRef.attachView(componentRef.hostView);

    const button = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    const canvas = this.document.querySelector('.main');
    canvas.appendChild(button);

    const {top, left} = this._calculateButtonPosition(button, canvas, line);

    button.style.top = top + 'px';
    button.style.left = left + 'px';
  }

  private _calculateButtonPosition(button, canvas, line) {
    const buttonClientRect = button.getBoundingClientRect();
    const buttonOffsetX = buttonClientRect.width / 2;
    const buttonOffsetY = buttonClientRect.height / 2;

    const middleHeightOfLine = this._middleHeightOfLine(line);

    return {
      top: middleHeightOfLine - buttonOffsetY,
      left: (canvas.clientWidth / 2) - buttonOffsetX + this._areaOffset()
    };
  }

  private _middleHeightOfLine(line) {
    return ( +line.attributes.y1.nodeValue + +line.attributes.y2.nodeValue) / 2;
  }

  private _areaOffset() {
    const source = this.commonService.sourceAreaWidth;
    const target = this.commonService.targetAreaWidth;

    return (Math.max(source, target) - Math.min(source, target)) / 2;
  }
}