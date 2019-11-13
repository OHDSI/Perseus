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

    const buttonOffsetX = Math.floor(buttonClientRect.width / 2);
    const buttonOffsetY =  Math.floor(buttonClientRect.height / 2);

    const { endXY } = line.attributes;
    const { startXY } = line.attributes;
    const pointStart = startXY.nodeValue.split(',');
    const pointEnd = endXY.nodeValue.split(',');

    const x = Math.floor(+pointStart[0]);
    const y = Math.floor(+pointStart[1]);
    const x1 = Math.floor(+pointEnd[0]);
    const y1 = Math.floor(+pointEnd[1]);

    return {
      top: y + Math.floor(canvasClientRect.y) - buttonOffsetY,
      left: Math.floor(canvasClientRect.x) + buttonOffsetX
    };
  }
}
