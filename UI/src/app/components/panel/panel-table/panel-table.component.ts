
import { Component, Input, Injector, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';

import { CommentsService } from 'src/app/services/comments.service';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PanelTableComponent {
  @Input() area: string;
  @Input() columns: any[];
  @Input() tableName: string;
  @Input() displayedColumns: string[];

  activeRow = null;
  data$: Observable<any>;

  constructor( 
    private commonService: CommonService,
    private commentsService: CommentsService,
    private overlay: Overlay,
    private injector: Injector,
    private cdRef: ChangeDetectorRef
    ) {};

  setActiveRow(area, table, row) {
    this.commonService.activeRow = {area, table, row};
  }

  showDialog(anchor) {
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

  hasComment(area, table, row) {
    return this.commentsService.hasComment(area, table, row);
  }

  private _getStartegy(anchor) {
    let offsetX = 0;
    let offsetY = 0;

    switch (this.area) {
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
      new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'bottom' }, offsetX, offsetY)
    ];

    return this.overlay.position().flexibleConnectedTo(anchor).withPositions(positions);

  }
}