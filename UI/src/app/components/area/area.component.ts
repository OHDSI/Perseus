import { Component, Input, ElementRef, AfterViewChecked, Injector } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ConnectionPositionPair, OverlayRef, OverlayConfig, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { FilterComponent } from '../filter/filter.component';

declare var require: any;

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})

export class AreaComponent implements AfterViewChecked {
  @Input() area: string;

  constructor(
    private commonService: CommonService,
    private elementRef: ElementRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private overlay: Overlay,
    private injector: Injector,
  ) {
    this.matIconRegistry
      .addSvgIcon(
        'filter',
        this.getSanitizedUrl('filter')
      )
  }

  ngAfterViewChecked() {
    // we need to set width of areas so that we could calculate position of a BridgeButton component.
    const element = this.elementRef.nativeElement;
    if (element.offsetWidth) {
      this.commonService.setAreaWidth(this.area, element.offsetWidth);
    }
  }

  get areaIsSource() {
    return this.area === 'source';
  }

  getSanitizedUrl(iconName) {
    const t = require(`src/assets/icons/${iconName}.svg`);
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`);
  }

  openFilterDialog(anchor) {
    const strategy = this._getStartegy(anchor);
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

    overlayRef.attach(new ComponentPortal(FilterComponent, null, injector));
  }

  private _getStartegy(anchor) {
    let offsetX = 0;
    let offsetY = 0;

    switch (this.area) {
      case 'source': {
        offsetX = 0;
        offsetY = 0;

        break;
      }
      case 'target': {
        offsetX = 0;
        offsetY = 0;

        break;
      }
      default:
        return null;
    }

    const positions = [
      new ConnectionPositionPair(
        {
          originX: 'start',
          originY: 'bottom'
        },
        {
          overlayX: 'start',
          overlayY: 'bottom'
        },
        100, 100)
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(positions);

  }

}
