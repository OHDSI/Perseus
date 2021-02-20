import { Component, OnInit } from '@angular/core';
import { VocabSearchReqParams, VocabularySearchService } from '../services/vocabulary-search.service';
import { Concept } from './concept';
import { Subject } from 'rxjs/internal/Subject';
import { switchMap, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';

export enum PaginationSpacer {
  NONE,
  LEFT,
  RIGHT
}

@Component({
  selector: 'app-vocabulary-search',
  templateUrl: './vocabulary-search.component.html',
  styleUrls: ['./vocabulary-search.component.scss']
})
export class VocabularySearchComponent extends BaseComponent implements OnInit {

  movableIndexes = {
    second: 2,
    third: 3,
  };

  currentPage = 1;

  pageCount = 1;

  concepts: Concept[] = [];

  requestInProgress = false;

  private requestParams: VocabSearchReqParams = {
    pageSize: 100,
    pageNumber: 1
  };

  private pageNumberRecognizer = {
    first: () => 1,
    second: () => this.movableIndexes.second,
    third: () => this.movableIndexes.third,
    fourth: () => this.pageCount
  };

  private requestStream$ = new Subject<VocabSearchReqParams>();

  constructor(private vocabularySearchService: VocabularySearchService) {
    super();
  }

  ngOnInit(): void {
    this.subscribeOnRequests();

    this.makeRequest(this.requestParams);
  }

  makeRequest(params: VocabSearchReqParams) {
    if (!this.requestInProgress) {
      this.requestInProgress = true;
    }
    this.requestStream$.next(params);
  }

  handleNavigation($event: MouseEvent) {
    const dataset = ($event.target as HTMLElement).dataset;
    const getPage = this.pageNumberRecognizer[dataset.page];
    const page = getPage ? getPage() : null;
    const arrow = dataset.arrow;

    let doRequest = false;

    if (page && page !== this.currentPage) {
      doRequest = this.handlePageNavigation(page);
    } else if (arrow) {
      doRequest = this.handleArrowNavigation(arrow);
    }

    if (doRequest) {
      this.makeRequest({
        ...this.requestParams,
        pageNumber: this.currentPage
      });
    }
  }

  private setPageCountAndUpdateView(pageCount): void {
    // todo update view
    this.pageCount = pageCount;
  }

  private handleArrowNavigation(arrow: string): boolean {
    if (arrow === 'left' && this.currentPage !== 1) {
      if (this.currentPage === this.movableIndexes.second && this.movableIndexes.second !== 2) {
        this.movableIndexes = {
          second: this.movableIndexes.second - 1,
          third: this.movableIndexes.third - 1
        };
      }
      this.currentPage--;

      return true;
    } else if (arrow === 'right' && this.currentPage !== this.pageCount) {
      if (this.currentPage === this.movableIndexes.third && this.movableIndexes.third !== this.pageCount - 1) {
        this.movableIndexes = {
          second: this.movableIndexes.second + 1,
          third: this.movableIndexes.third + 1
        };
      }
      this.currentPage++;

      return true;
    }

    return false;
  }

  private handlePageNavigation(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      if (page === 1 && this.movableIndexes.second !== 2) {
        this.movableIndexes = {
          second: 2,
          third: 3
        };
      } else if (page === this.pageCount && this.movableIndexes.third !== this.pageCount - 1) {
        this.movableIndexes = {
          second: this.pageCount - 2,
          third: this.pageCount - 1
        };
      }

      return true;
    }

    return false;
  }

  private subscribeOnRequests() {
    this.requestStream$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(params => this.vocabularySearchService.search(params))
      )
      .subscribe(result => {
        this.concepts = result.content;
        if (this.pageCount !== result.totalPages) {
          this.setPageCountAndUpdateView(result.totalPages);
        }
        this.requestInProgress = false;
      }, error => {
        // todo handle error
        this.requestInProgress = false;
      });
  }
}
