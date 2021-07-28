import { Component, Inject } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { IRow } from 'src/app/models/row';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-popup',
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss'],
  providers: [CommentService]
})
export class CommentPopupComponent {

  row: IRow;

  value: string

  constructor(
    public dialogRef: MatDialogRef<CommentPopupComponent>,
    private commentService: CommentService,
    @Inject(MAT_DIALOG_DATA) private payload: IRow
  ) {
    this.row = this.payload;
    this.value = this.isEdit ? this.comment.text : ''
  }

  get isEdit() {
    return this.row.comments?.length > 0
  }

  get comment() {
    return this.row.comments[0]
  }

  onSave(value: string) {
    if (this.isEdit) {
      this.commentService.editComment(this.comment, value)
    } else {
      this.commentService.addComment(this.row, value)
    }
    this.dialogRef.close()
  }

  onDelete() {
    this.commentService.deleteComment(this.row, this.comment)
    this.dialogRef.close()
  }
}
