import { Injectable, Injector } from '@angular/core';
import {
  ConnectionPositionPair,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { OverlayConfigOptions } from './overlay-config-options.interface';
import { OVERLAY_DIALOG_DATA } from './overlay-dialog-data';
import { Observable, Subject } from 'rxjs';

export class OverlayDialogRef {
  get close$(): Observable<OverlayConfigOptions> {
    return this.closeSubject.asObservable();
  }

  private closeSubject = new Subject<OverlayConfigOptions>();

  constructor(private overlayRef: OverlayRef) {}

  close(configOptions?: OverlayConfigOptions | any) {
    this.overlayRef.dispose();

    if (configOptions) {
      this.closeSubject.next(configOptions);
    } else {
      this.closeSubject.next();
    }
  }
}

@Injectable()
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open(
    configOptions: OverlayConfigOptions,
    anchor: any,
    component: any
  ): OverlayDialogRef {
    const config = this.getOverlayConfig(configOptions, anchor);

    const overlayRef = this.overlay.create(config);

    const dialogRef = new OverlayDialogRef(overlayRef);

    overlayRef.backdropClick().subscribe(() => dialogRef.close(configOptions));

    const injector = this.createInjector(configOptions, dialogRef);

    overlayRef.attach(new ComponentPortal(component, null, injector));

    return dialogRef;
  }

  getOverlayConfig(config: OverlayConfigOptions, ancor: any): OverlayConfig {
    const positionStrategy = this.getOverlayPosition(ancor, config.positionStrategyFor);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  getOverlayPosition(anchor, strategyFor): any {
    let offsetX = 0;
    let offsetY = 0;
    let originX = null;
    let originY = null;
    let overlayX = null;
    let overlayY = null;

    switch (strategyFor) {
      case 'advanced-transform': {
        offsetX = -200;
        offsetY = 0;
        originX = 'end';
        originY = 'top';
        overlayX = 'end';
        overlayY = 'top';
        break;
      }
      case 'simple-transform': {
        offsetX = 183;
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
          originY
        },
        {
          overlayX,
          overlayY
        },
        offsetX,
        offsetY
      )
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(positions);
  }

  createInjector(
    config: OverlayConfigOptions,
    dialogRef: OverlayDialogRef
  ): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(OverlayDialogRef, dialogRef);

    if (config.payload) {
      injectionTokens.set(OVERLAY_DIALOG_DATA, config.payload);
    }

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }
}
