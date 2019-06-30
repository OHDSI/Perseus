import { Injectable, Injector } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';

@Injectable()
export class OverlayService {
  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) { }

  openDialog(anchor, component, strategyFor) {
    const strategy = this._strategyFactory(anchor, strategyFor);
    const config = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      positionStrategy: strategy
    });
    const overlayRef = this.overlay.create(config);
    const injector = new PortalInjector(
      this.injector,
      new WeakMap<any, any>([[OverlayRef, overlayRef]])
    );

    overlayRef.attach(new ComponentPortal(component, null, injector));

    return overlayRef;
  }

  overlayPositionFactory() {

  }

  private _strategyFactory(anchor, strategyFor) {
    let offsetX = 0;
    let offsetY = 0;
    let originX = null;
    let originY = null;
    let overlayX = null;
    let overlayY = null;

    switch (strategyFor) {
      case 'bridge-button': {
        offsetX = 238;
        offsetY = 28;
        originX = 'end';
        originY = 'top';
        overlayX = 'end';
        overlayY = 'top';
        break;
      }
      case 'values': {
        offsetX = 40;
        offsetY = 0;
        originX = 'start';
        originY = 'top';
        overlayX = 'start';
        overlayY = 'top';
        break;
      }
      case 'comments-source': {
        offsetX = 40;
        offsetY = 32;
        originX = 'start';
        originY = 'bottom';
        overlayX = 'start';
        overlayY = 'bottom';
        break;
      }
      case 'comments-target': {
        offsetX = -205;
        offsetY = -35;
        originX = 'start';
        originY = 'bottom';
        overlayX = 'start';
        overlayY = 'bottom';
        break;
      }
    }

    const positions = [
      new ConnectionPositionPair(
        {
          originX,
          originY,
        },
        {
          overlayX,
          overlayY,
        },
        offsetX, offsetY)
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(positions);
  }

}
