import { Component, Inject, ViewChild } from '@angular/core';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { TransformRulesData } from './model/transform-rules-data';
import { TransformationInputComponent } from './transformation-input/transformation-input.component';
import { SqlFunction } from './transformation-input/model/sql-string-functions';

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent {
  @ViewChild('tinput') tinput: TransformationInputComponent;

  get sourceColumnname(): string {
    return this.payload.connector.source.name || '';
  }

  get targetColumnName(): string {
    return this.payload.connector.target.name || '';
  }

  get applyedCriteria(): string[] {
    return this.criteria.map(c => c.name);
  }

  criteria = Array<SqlFunction>();
  removable = true;

  constructor(
    public dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public payload: TransformRulesData
  ) {
    const { arrowCache, connector } = this.payload;
    if (arrowCache[connector.id]) {
      this.criteria = arrowCache[connector.id].transforms || [];
    }
  }

  onTransformSelected(event: SqlFunction): void {
    this.criteria.push(event);
  }

  // TODO use command patter
  apply() {
    const { arrowCache, connector } = this.payload;
    if (arrowCache[connector.id]) {
      arrowCache[connector.id].transforms = this.criteria;
    }

    this.dialogRef.close();
  }

  deleteLink() {}

  close() {
    this.dialogRef.close();
  }

  removeTransform(transfromName: string) {
    const index = this.criteria.findIndex(criteria => criteria.name === transfromName);
    if (index > -1) {
      this.criteria.splice(index, 1);

      this.tinput.clear();
    }
  }
}
