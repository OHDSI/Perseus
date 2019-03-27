import { Component, OnInit, Input, ViewChild, ElementRef, Injector, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommentsService } from 'src/app/pages/mapping/services/comments.service';
import { DragService } from 'src/app/pages/mapping/services/drag.service';
import { Overlay, CdkOverlayOrigin, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { DialogComponent } from '../../dialog/dialog.component';
import { CommonService } from '../../../services/common.service';

export interface Column {
  column_name: string;
  column_type: string;
}

@Component({
  selector: 'app-panel-table',
  templateUrl: './panel-table.component.html',
  styleUrls: ['./panel-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PanelTableComponent {
  @Input() area: string;
  @Input() columns: Column[];
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
    ) {

    };

  setActiveRow(area, table, row) {
    this.commonService.activeRow = {area, table, row};
  }

  showDialog(anchor) {
    const strategy = this.overlay.position().connectedTo(anchor, {originX: 'end', originY: 'top'}, {overlayX: 'start', overlayY: 'top'});
    const config = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      positionStrategy: strategy
    });
    const overlayRef = this.overlay.create(config);
    const injector = new PortalInjector(
      this.injector,
      new WeakMap<any, any>([[OverlayRef, overlayRef]])
    )

    overlayRef.attach(new ComponentPortal(DialogComponent, null, injector));
    overlayRef.backdropClick().subscribe(() => this.cdRef.detectChanges());
  }

  hasComment(area, table, row) {
    return this.commentsService.hasComment(area, table, row);
  }
}
