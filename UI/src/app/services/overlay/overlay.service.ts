import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OverlayConfigOptions } from './overlay-config-options.interface';
import { OVERLAY_DIALOG_DATA } from './overlay-dialog-data';
import * as positionsData from './positions.json';

export class OverlayDialogRef {

  private closeSubject = new Subject<OverlayConfigOptions>();

  constructor(private overlayRef: OverlayRef) {
  }

  get afterClosed$(): Observable<OverlayConfigOptions> {
    return this.closeSubject.asObservable();
  }

  get overlayElement(): HTMLElement {
    return this.overlayRef.overlayElement
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
  readonly strategies = (positionsData as any).positions;

  constructor(private overlay: Overlay, private injector: Injector) {
  }

  open(
    configOptions: OverlayConfigOptions,
    anchor: any,
    componentType: any
  ): OverlayDialogRef {
    const config = this.getOverlayConfig(configOptions, anchor);

    const overlayRef = this.overlay.create(config);

    const dialogRef = new OverlayDialogRef(overlayRef);

    overlayRef.backdropClick().subscribe(() => dialogRef.close(configOptions));

    const injector = this.createInjector(configOptions, dialogRef);

    overlayRef.attach(new ComponentPortal(componentType, null, injector));

    return dialogRef;
  }

  getOverlayConfig(config: OverlayConfigOptions, anchor: any): OverlayConfig {
    const positionStrategy = this.getOverlayPosition(anchor, config.positionStrategyFor);
    const scrollStrategy = this.overlay.scrollStrategies.block();
    const {hasBackdrop, backdropClass, panelClass} = config;

    return new OverlayConfig({hasBackdrop, backdropClass, panelClass, positionStrategy, scrollStrategy});
  }

  getOverlayPosition(anchor, strategyFor): FlexibleConnectedPositionStrategy {
    let positions = [this.strategies['right-bottom'], this.strategies['left-top']];
    if (strategyFor && this.strategies[strategyFor]) {
      const {offsetX, offsetY, originX, originY, overlayX, overlayY} = this.strategies[strategyFor];
      positions = [
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
    }

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
