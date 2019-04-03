import { Component, ViewChild, Renderer2, AfterViewInit, OnDestroy, ViewEncapsulation, TemplateRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CommentsService } from 'src/app/services/comments.service';
import { CommonService } from 'src/app/services/common.service';
import { IComment, Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('readOnlyTemplate') readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate') editTemplate: TemplateRef<any>;

  private listener: () => void;
  private value: string;
  private comments: IComment[] = [];
  private editedComment: IComment;

  constructor(
    private overlay: OverlayRef,
    private renderer: Renderer2,
    private commentsService: CommentsService,
    private commonService: CommonService
    ) {
      commentsService.prepareForCommenting();

      const activeRow = commonService.activeRow;
      this.comments = commentsService.comments[activeRow.area][activeRow.table][activeRow.row].comments;
    }

  ngAfterViewInit() {
    this.listener = this.renderer.listen(this.overlay.backdropElement, 'click', () => this.close());
  }

  ngOnDestroy() {
    this.listener();
  }

  overSourceArea() {
    return this.commonService.activeRow.area === 'source';
  }

  loadTemplate(comment: IComment): TemplateRef<any> {
    if (this.editedComment && this.editedComment.id === comment.id) {
      return this.editTemplate;
    }

    return this.readOnlyTemplate;
  }

  edit(comment: IComment) {
    this.editedComment = comment;
  }

  add() {
    if (!this.value) {
      return;
    }

    const comment = new Comment(this.value);
    this.commentsService.addComment(this.commonService.activeRow, comment);
    this.reset();
  }

  delete(comment: IComment) {
    const idx = this.comments.indexOf(comment);
    this.comments.splice(idx, 1);

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