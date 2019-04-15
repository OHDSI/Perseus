import { Component, Injector } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IComment } from 'src/app/models/comment';
import { IRow } from 'src/app/models/row';

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent {
  selectedRule: string;

  constructor(
    private overlay: OverlayRef,
    private injector: Injector,
    private commonService: CommonService
  ) {
    overlay.backdropClick().subscribe(() => this.close());
  }

  apply() {
    if (this.selectedRule) {
      switch (this.selectedRule) {
        case 'log-values': {
          const sourceRowValue = this.commonService.activeConnector.source.name;
          const connections = this.commonService.activeConnector.source.connections;
          connections.forEach(row => {
            console.log(sourceRowValue , '--->', row.name);
          });
          this.close();
          break;
        }
        case 'log-comments': {
          const connections = this.commonService.activeConnector.source.connections;
          if (connections.length) {
            connections.forEach((row: IRow) => {
              if (row.comments) {
                row.comments.forEach((comment: IComment) => {
                  console.log(comment);
                });
              }
            });
          }
          this.close();
          break;
        }
      }
    }
  }

  deleteLink() {
    const drawService = this.injector.get(DrawService);
    const connector = this.commonService.activeConnector;

    drawService.removeConnector(connector.id);
    this.close();
  }

  close() {
    this.overlay.detach();
    this.commonService.activeConnector = null;
  }

}
