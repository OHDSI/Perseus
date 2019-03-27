import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, OnDestroy, ViewEncapsulation, TemplateRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { CommentsService } from 'src/app/pages/mapping/services/comments.service';
import { CommonService } from 'src/app/pages/mapping/services/common.service';
import { Store, select } from '@ngrx/store';

export interface IComment {
  id: number;
  text: string;
  date: Date;
  hasBeenEdited: boolean;
}

export class Comment {
  id: number;
  text: string;
  date: Date;
  hasBeenEdited: false;

  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
    this.date = new Date(Date.now());
  }
}

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
  private value: any;
  private comments: IComment[] = [];
  private editedComment: IComment;

  constructor(
    private overlay: OverlayRef,
    private renderer: Renderer2,
    private commentsService: CommentsService,
    private commonService: CommonService,
    private store: Store<any>
    ) {
      commentsService.prepareForCommenting();

      const activeRow = commonService.activeRow;
      const comments$ = store.pipe(select('comments'));
      comments$.subscribe(val => this.comments = val[activeRow.area][activeRow.table][activeRow.row].comments);
    }

  ngAfterViewInit() {
    this.listener = this.renderer.listen(this.overlay.backdropElement, 'click', () => this.close());
  }

  loadTemplate(comment: IComment) {
    if (this.editedComment && this.editedComment.id === comment.id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  edit(comment: IComment) {
    this.editedComment = comment;
  }

  add() {
    if (!this.value) {
      return;
    }

    const id = Math.floor(Math.random() * 1000000);
    const comment = new Comment(id, this.value);

    this.commentsService.addComment(this.commonService.activeRow, comment);
    this.reset();
  }

  delete(comment: IComment) {
    const idx = this.comments.indexOf(comment);
    this.comments.splice(idx, 1);
  }

  applyChanges(comment: IComment, value: string) {
    comment.hasBeenEdited = true;
    comment.text = value;
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

  ngOnDestroy() {
    this.listener();
  }

}