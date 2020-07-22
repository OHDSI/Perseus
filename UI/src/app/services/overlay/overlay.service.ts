import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OverlayConfigOptions } from './overlay-config-options.interface';
import { OVERLAY_DIALOG_DATA } from './overlay-dialog-data';
import * as strategiesData from './strategies.json';

export class OverlayDialogRef {
  get afterClosed$(): Observable<OverlayConfigOptions> {
    return this.closeSubject.asObservable();
  }

  private closeSubject = new Subject<OverlayConfigOptions>();

  constructor(private overlayRef: OverlayRef) {
  }

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
  readonly strategies = (strategiesData as any).strategies;
  constructor(private overlay: Overlay, private injector: Injector) {
  }

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
    const scrollStrategy = this.overlay.scrollStrategies.block();
    const {hasBackdrop, backdropClass, panelClass} = config;

    return new OverlayConfig({hasBackdrop, backdropClass, panelClass, positionStrategy, scrollStrategy});
  }

  getOverlayPosition(anchor, strategyFor): any {
    let offsets = {
      offsetX: 0,
      offsetY: 0,
      originX: null,
      originY: null,
      overlayX: null,
      overlayY: null
    };
    if (this.strategies[strategyFor]) {
      offsets = {...offsets, ...this.strategies[strategyFor]};
    }

    const {offsetX, offsetY, originX, originY, overlayX, overlayY} = offsets;
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
