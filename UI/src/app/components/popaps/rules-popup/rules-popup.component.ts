import { Component, Inject, ViewChild } from '@angular/core';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { TransformRulesData } from './model/transform-rules-data';
import { TransformationInputComponent } from './transformation-input/transformation-input.component';
import { SqlFunction } from './transformation-input/model/sql-string-functions';
import { RulesPopupService } from './services/rules-popup.service';

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent {
  @ViewChild('tinput') tinput: TransformationInputComponent;

  selectedTransform: SqlFunction = new SqlFunction();

  get sourceColumnname(): string {
    return this.payload.connector.source.name || '';
  }

  get targetColumnName(): string {
    return this.payload.connector.target.name || '';
  }

  get applyedCriteria(): SqlFunction[] {
    return this.criterias;
  }

  criterias = Array<SqlFunction>();
  removable = true;

  constructor(
    private rulesPopupService: RulesPopupService,
    public dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public payload: TransformRulesData
  ) {
    const { arrowCache, connector } = this.payload;
    if (arrowCache[connector.id]) {
      this.criterias = arrowCache[connector.id].transforms || [];
    }
  }

  onTransformSelected(event: SqlFunction): void {
    this.criterias.push(event);
  }

  // TODO use command patter
  apply() {
    const { arrowCache, connector } = this.payload;
    if (arrowCache[connector.id]) {
      arrowCache[connector.id].transforms = this.criterias;
    }

    this.dialogRef.close();
  }

  deleteLink() {
    this.rulesPopupService.deleteConnector();
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  removeTransform(index: number) {
    this.criterias.splice(index, 1);
    this.tinput.clearEditor();
  }

  viewTransform(index: number) {
    this.selectedTransform = this.criterias[index];
  }
}
