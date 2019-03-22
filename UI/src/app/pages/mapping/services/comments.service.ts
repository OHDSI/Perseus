import { Injectable } from '@angular/core';

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
  private _commentsStore: CommentsStore = {
    'source': {},
    'target': {}
  };

  constructor() { }

  prepareForCommenting(tableTitle: string, panelTitle: string, rowName: string) {
    const commentsStore = this._commentsStore;

    if (!(panelTitle in commentsStore[tableTitle])) {
      commentsStore[tableTitle][panelTitle] = {};
    };

    const table = commentsStore[tableTitle][panelTitle];
    if (!(rowName in table)) {
      const row: any = table[rowName] = {};
      row.comments = [];
    }

  }
}
