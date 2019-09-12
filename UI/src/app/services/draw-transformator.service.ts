import {
  Injectable,
  Renderer2,
  RendererFactory2,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef
} from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { BridgeButtonComponent } from '../components/bridge-button/bridge-button.component';
import { middleHeightOfLine, areaOffset } from './utilites/draw-utilites';
import { IConnector } from '../models/interface/connector.interface';

@Injectable()
export class DrawTransformatorService {
  get listIsEmpty(): boolean {
    return Object.keys(this.list).length === 0;
  }

  private list = {};
  private renderer: Renderer2;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private commonService: CommonService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  appendButton(drawEntity: IConnector) {
    const line = drawEntity.line;
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(BridgeButtonComponent)
      .create(this.injector);
    componentRef.instance.drawEntity = drawEntity;

    this.appRef.attachView(componentRef.hostView);

    const button = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    const mainCanvas = this.commonService.mainCanvas.nativeElement;

    this.renderer.appendChild(mainCanvas, button);

    const { top, left } = this._calculateButtonPosition(button, line, mainCanvas);

    button.style.top = top + 'px';
    button.style.left = left + 'px';

    drawEntity.attachButton(button);

    return button;
  }

  recalculateButtonPosition(button, line) {
    const canvas = this.commonService.mainCanvas.nativeElement;
    const { top, left } = this._calculateButtonPosition(button, line, canvas );

    button.style.top = top + 'px';
    button.style.left = left + 'px';
  }

  private _calculateButtonPosition(button, line, canvas) {
    const buttonClientRect = button.getBoundingClientRect();
    const buttonOffsetX = buttonClientRect.width / 2;
    const buttonOffsetY = buttonClientRect.height / 2;

    const sourceArea = this.commonService.getAreaWidth('source');
    const targetArea =  this.commonService.getAreaWidth('target');
    return {
      top: middleHeightOfLine(line) - buttonOffsetY,
      left: canvas.clientWidth / 2 - buttonOffsetX - areaOffset(sourceArea, targetArea)
    };
  }
}
