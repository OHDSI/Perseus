import { Component, Input, Injector, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, DomPortalHost } from '@angular/cdk/portal';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { IRow } from 'src/app/components/pages/mapping/mapping.component';
import { ValuesPopapComponent } from '../../popaps/values-popap/values-popap.component';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PanelTableComponent {
  @Input() table: any;
  @Input() displayedColumns: string[];
  @ViewChild('htmlElement', {read: ElementRef}) element: any;

  constructor(
    private commonService: CommonService,
    private overlay: Overlay,
    private injector: Injector,
    private cdRef: ChangeDetectorRef
  ) {};
 
  get visibleRows() {
    return this.rows.filter(row => row.visible);
  }

  get rows() {
    return this.table.rows;
  }

  get area() {
    return this.table.area;
  }

  get totalRowsNumber() {
    return this.table.rows.length;
  }
  get visibleRowsNumber() {
    return this.table.rows.filter(row => row.visible).length;
  }

  setActiveRow(row: IRow) {
    this.commonService.activeRow = row;
  }

  openTopValuesDialog(anchor) {
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

    overlayRef.attach(new ComponentPortal(ValuesPopapComponent, null, injector));
  }

  openCommentDialog(anchor) {
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

    overlayRef.attach(new ComponentPortal(DialogComponent, null, injector));
    // due to ngClass directive triggers change detection too often,
    // we have to use onPush strategy here and detect changes after clicking on a backdrop
    overlayRef.backdropClick().subscribe(() => this.cdRef.detectChanges());
  }

  hasComment(row) {
    return row.comments.length;
  }

  private _getStartegy(anchor) {
    let offsetX = 0;
    let offsetY = 0;

    switch (this._getArea()) {
      case 'source': {
        offsetX = 40;
        offsetY = 44;

        break;
      }
      case 'target': {
        offsetX = -200;
        offsetY = -40;

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
        offsetX, offsetY)
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(positions);
  }

  private _getStartegyForValues(anchor) {
    let offsetX = 40;

    const positions = [
      new ConnectionPositionPair(
        {
          originX: 'start',
          originY: 'top'
        },
        {
          overlayX: 'start',
          overlayY: 'top'
        },
        offsetX, null)
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(positions);
  }

  private _getArea() {
    return this.table.area;
  }
}