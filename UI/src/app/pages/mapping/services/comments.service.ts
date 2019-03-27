import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as commentsActions from 'src/app/pages/mapping/store/actions/comments.actions';
import { CommonService } from 'src/app/pages/mapping/services/common.service';

//TODO: create normal interfaces
export interface CommentsStore {
  'source': {
    [panelTitle: string]: {
      [rowName: string]: {
        comments: []
      }
    }
  },
  'target': {
    [panelTitle: string]: {
      [rowName: string]: {
        comments: []
      }
    }
  }
}

@Injectable()
export class CommentsService {
  comments: any;

  constructor(
    private store: Store<any>,
    private commonService: CommonService
  ) 
  {
    const comments$ = store.pipe(select('comments'));
    comments$.subscribe(comments => this.comments = comments);
  }

  prepareForCommenting() {
    const {area, table, row} = this.commonService.activeRow;
    const comments = this.comments;

    if (!(table in comments[area])) {
      comments[area][table] = {};
    };

    const panelTable = comments[area][table];
    if (!(row in panelTable)) {
      const r: any = panelTable[row] = {};
      r.comments = [];
    }
  }

  addComment({area, table, row}, comment) {
    this.comments[area][table][row].comments.push(comment);

    this.store.dispatch(new commentsActions.Update());
  }

  hasComment(area, table, row) {
    try {
      return this.comments[area][table][row].comments.length;
    } catch (err) {
      return false;
    }
  }

}
