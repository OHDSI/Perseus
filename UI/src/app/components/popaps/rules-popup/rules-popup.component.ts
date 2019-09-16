import { Component, Injector, Inject } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { CommonService } from 'src/app/services/common.service';
import { IComment } from 'src/app/models/comment';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent {
  selectedRule: string;

  constructor(
    public dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  // ???
  apply() {
    if (this.selectedRule) {
      switch (
        this.selectedRule
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
      ) {
      }
    }
  }

  deleteLink() {}

  close() {
    this.dialogRef.close();
  }
}
