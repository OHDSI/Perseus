import { Component, ViewChild, TemplateRef, Inject } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { IComment } from 'src/app/models/comment';
import { IRow } from 'src/app/models/row';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';

@Component({
  selector: 'app-add-constant-popup',
  templateUrl: './add-constant-popup.component.html',
  styleUrls: ['./add-constant-popup.component.scss']
})
export class AddConstantPopupComponent {
  @ViewChild('readOnlyTemplate') readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate') editTemplate: TemplateRef<any>;

  value: string;

  constructor(
    private dialogRef: OverlayDialogRef,
    @Inject(OVERLAY_DIALOG_DATA) public payload: any
  ) {
    this.value = this.payload.value;
  }

  add() {
    if (!this.value) {
      return;
    }
    this.payload.value = this.value;
    this.close();
  }

  clear() {
    this.value = null;
    this.payload.value = this.value;
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
