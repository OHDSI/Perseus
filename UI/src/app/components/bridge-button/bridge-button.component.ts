import { Component, OnInit, Injector } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { RulesPopupComponent } from 'src/app/components/popaps/rules-popup/rules-popup.component';

@Component({
  selector: 'app-bridge-button',
  templateUrl: './bridge-button.component.html',
  styleUrls: ['./bridge-button.component.scss']
})
export class BridgeButtonComponent implements OnInit {
  text = '?';

  constructor(private overlay: Overlay, private injector: Injector) { }

  ngOnInit() {
  }

  openRulesDialog(anchor) {
    const strategy = this._getStartegyForValues(anchor);
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

    overlayRef.attach(new ComponentPortal(RulesPopupComponent, null, injector));
  }

  private _getStartegyForValues(anchor) {
    let offsetX = 225;
    let offsetY = 50;
    const positions = [
      new ConnectionPositionPair(
        {
          originX: 'end',
          originY: 'top'
        },
        {
          overlayX: 'end',
          overlayY: 'top'
        },
        offsetX, offsetY)
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(positions);
  }

}
