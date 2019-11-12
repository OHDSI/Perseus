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
import { BRIDGE_BUTTON_DATA } from '../components/bridge-button/model/bridge-button-injector';
import { ArrowCache } from '../models/arrow-cache';

@Injectable()
export class BridgeButtonService {
  get listIsEmpty(): boolean {
    return Object.keys(this.list).length === 0;
  }

  private list = {};
  private renderer: Renderer2;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private commonService: CommonService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  createButton(drawEntity: IConnector, arrowsCache: ArrowCache) {
    const line = drawEntity.svgPath;

    const injector = Injector.create({
      providers: [
        {
          provide: BRIDGE_BUTTON_DATA,
          useValue: { connector: drawEntity, arrowCache: arrowsCache }
        }
      ]
    });

    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(BridgeButtonComponent)
      .create(injector);

    componentRef.instance.drawEntity = drawEntity;

    this.appRef.attachView(componentRef.hostView);

    const button = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    const { mainElement, svgCanvas } = this.commonService;

    this.renderer.appendChild(mainElement.nativeElement, button);

    const { top, left } = this._calculateButtonPosition(
      button,
      line,
      svgCanvas.nativeElement
    );

    button.style.top = top + 'px';
    button.style.left = left + 'px';

    drawEntity.attachButton(button);

    return button;
  }

  recalculateButtonPosition(button, line) {
    const mainElement = this.commonService.mainElement.nativeElement;
    const canvasElement = this.commonService.svgCanvas.nativeElement;

    const { top, left } = this._calculateButtonPosition(
      button,
      line,
      canvasElement
    );

    button.style.top = top + 'px';
    button.style.left = left + 'px';
  }

  private _calculateButtonPosition(button, line, canvasElement) {
    const canvasClientRect = canvasElement.getBoundingClientRect();
    const buttonClientRect = button.getBoundingClientRect();

    const buttonOffsetX = buttonClientRect.width / 2;
    const buttonOffsetY = buttonClientRect.height / 2;

    const { endXY } = line.attributes;
    const pointEnd = endXY.nodeValue.split(',');

    return {
      top: +pointEnd[1] + canvasClientRect.y - buttonOffsetY,
      left: canvasClientRect.x + buttonOffsetX
    };
  }
}
