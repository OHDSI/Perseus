import { Component, ViewChild, TemplateRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CommonService } from 'src/app/services/common.service';
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

  private value: string;
  private editedComment: IComment;
  private row: IRow;

  constructor(
    private overlay: OverlayRef,
    private commonService: CommonService
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

  edit(comment: IComment) {
    this.editedComment = comment;
  }

  add() {
    if (!this.value) {
      return;
    }

    const comment = new Comment(this.value);
    this.row.comments.push(comment);
    this.reset();
  }

  delete(comment: IComment) {
    const idx = this.row.comments.indexOf(comment);
    this.row.comments.splice(idx, 1);

    this.editedComment = null;
  }

  applyChanges(comment: IComment, value: string) {
    comment.newValue(value);
    comment.setAsEdited();
    comment.updateDate();

    this.editedComment = null;
  }

  discardChanges() {
    this.editedComment = null;
  }

  reset() {
    this.value = '';
  }

  close() {
    this.overlay.detach();
  }

  isDisabled() {
    return !!this.editedComment;
  }
}
