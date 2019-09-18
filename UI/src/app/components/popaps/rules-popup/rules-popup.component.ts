import { Component, Injector, Inject } from '@angular/core';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { TransformRulesData } from './model/transform-rules-data';
import { IConnector } from 'src/app/models/interface/connector.interface';

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent {
  get targetColumnName(): string {
    return this.payload.connector.target.name || '';
  }

  get applyedCriteria(): string[] {
    return this.criteria;
  }

  criteria = [];
  connector: IConnector;

  constructor(
    public dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public payload: TransformRulesData
  ) {
    this.connector = payload.connector;
  }

  onTransformSelected(event: string): void {
    this.criteria.push(event);
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
