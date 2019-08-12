import { Component, Injector } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { CommonService } from 'src/app/services/common.service';
import { IComment } from 'src/app/models/comment';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';

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

  // ???
  apply() {
    if (this.selectedRule) {
      switch (this.selectedRule) {
        // case 'log-values': {
        //   const sourceRowValue = this.commonService.activeConnector.source.name;
        //   const connections = this.commonService.activeConnector.source.connections;
        //   connections.forEach(row => {
        //     console.log(sourceRowValue , '--->', row.name);
        //   });
        //   this.close();
        //   break;
        // }
        // case 'log-comments': {
        //   const connector = this.commonService.activeConnector;
        //   const connections = connector.source.connections;
        //   if (connector.source.comments) {
        //     connector.source.comments.forEach((comment: IComment) => {
        //       console.log(comment);
        //     });
        //   }

        //   if (connections.length) {
        //     connections.forEach((row: IRow) => {
        //       if (row.comments) {
        //         row.comments.forEach((comment: IComment) => {
        //           console.log(comment);
        //         });
        //       }
        //     });
        //   }
        //   this.close();
        //   break;
        // }
      }
    }
  }

  deleteLink() {
    const bridgeService = this.injector.get(BridgeService);
    const connector = this.commonService.activeConnector;

    bridgeService.deleteArrow(connector.id);
    this.close();
  }

  close() {
    this.overlay.detach();
    this.commonService.activeConnector.inactive();
    this.commonService.activeConnector = null;
  }

}
