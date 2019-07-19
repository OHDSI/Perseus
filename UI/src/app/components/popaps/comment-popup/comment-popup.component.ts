import { Component, ViewChild, TemplateRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CommonService } from 'src/app/services/common.service';
import { CommentService } from 'src/app/services/comment.service';
import { IComment, Comment } from 'src/app/models/comment';
import { IRow } from 'src/app/models/row';

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
    private overlay: OverlayRef,
    private commonService: CommonService,
    private commentService: CommentService
  ) {
    this.row = this.commonService.activeRow;
    this.overlay.backdropClick().subscribe(() => this.close());
  }

  loadTemplate(comment: IComment): TemplateRef<any> {
    if (this.editedComment && this.editedComment.id === comment.id) {
      return this.editTemplate;
    }

    return this.readOnlyTemplate;
  }

  get overSourceArea() {
    return this.commonService.activeRow.area === 'source';
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

    this.commentService.addComment(this.row, this.value)
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
    this.overlay.detach();
  }

  isDisabled() {
    return !!this.editedComment;
  }
}
