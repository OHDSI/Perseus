import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-add-constant-popup',
  templateUrl: './add-constant-popup.component.html',
  styleUrls: ['./add-constant-popup.component.scss'],
  providers: [ValidationService]
})
export class AddConstantPopupComponent {
  @ViewChild('readOnlyTemplate', { static: false }) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false }) editTemplate: TemplateRef<any>;

  value: string;
  mode: string;
  type: string;
  validationError: string;

  constructor(
    private dialogRef: OverlayDialogRef,
    private validationService: ValidationService,
    @Inject(OVERLAY_DIALOG_DATA) public payload: any
  ) {
    this.value = this.payload.value;
    this.mode = this.payload.mode;
    this.type = this.payload.type;
  }

  add() {
    if (!this.value) {
      return;
    }
    this.validationError = this.validationService.validateInput(this.type, this.value);
    if (this.validationError) {
      return;
    }
    this.payload.value = this.value.toString();
    this.close();
  }

  changeMode(mode) {
    this.mode = mode;
  }

  cancel() {
    this.close();
  }

  delete() {
    this.value = null;
    this.payload.value = this.value;
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
