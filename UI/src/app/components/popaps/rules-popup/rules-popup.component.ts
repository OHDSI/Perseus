import { Component, Injector, Inject } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { CommonService } from 'src/app/services/common.service';
import { IComment } from 'src/app/models/comment';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { TransformRulesData } from './model/transform-rules-data';

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent {
  constructor(
    public dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public payload: TransformRulesData
  ) {}

  onTransformSelected(transfrom: string): void {
    this.payload.criteria.push(transfrom);
  }

  // TODO use command patter
  apply() {
    this.dialogRef.close();
  }

  deleteLink() {}

  close() {
    this.dialogRef.close();
  }
}
