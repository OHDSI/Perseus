import { Component, ViewChild, TemplateRef, Inject } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { IComment } from 'src/app/models/comment';
import { IRow } from 'src/app/models/row';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';

@Component({
  selector: 'app-dialog',
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss']
})
export class CommentPopupComponent {
  @ViewChild('readOnlyTemplate') readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate') editTemplate: TemplateRef<any>;

  value: string;
  editedComment: IComment;
  row: IRow;

  constructor(
    private dialogRef: OverlayDialogRef,
    private commentService: CommentService,
    @Inject(OVERLAY_DIALOG_DATA) public payload: IRow
  ) {
    this.row = this.payload;
  }

  loadTemplate(comment: IComment): TemplateRef<any> {
    if (this.editedComment && this.editedComment.id === comment.id) {
      return this.editTemplate;
    }

    return this.readOnlyTemplate;
  }

  get overSourceArea() {
    return this.row.area === 'source';
  }

  onCommentClick(comment: IComment) {
    this.invalidateSelection();
    comment.active = true;
  }

  invalidateSelection(e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.row.comments.map((c: IComment) => c.active = false);
  }

  edit(comment: IComment) {
    this.editedComment = comment;
  }

  add() {
    this.invalidateSelection();
    if (!this.value) {
      return;
    }

    this.commentService.addComment(this.row, this.value);
    this.reset();
  }

  delete(comment: IComment) {
    this.commentService.deleteComment(this.row, comment);
    this.editedComment = null;
  }

  applyChanges(comment: IComment, value: string) {
    this.commentService.editComment(comment, value);
    this.invalidateSelection();
    this.editedComment = null;
  }

  discardChanges() {
    this.invalidateSelection();
    this.editedComment = null;
  }

  reset() {
    this.value = '';
  }

  close() {
    this.invalidateSelection();
    this.dialogRef.close();
  }

  isDisabled() {
    return !!this.editedComment;
  }
}
