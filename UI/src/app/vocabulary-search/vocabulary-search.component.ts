import { Component, OnInit } from '@angular/core';
import { VocabSearchReqParams, VocabularySearchService } from '../services/vocabulary-search.service';
import { Concept } from './concept';

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
export class VocabularySearchComponent implements OnInit {

  movableIndexes = {
    second: 2,
    third: 3,
  };

  currentPage = 1;

  pageCount = 1;

  private pageNumberRecognizer = {
    first: () => 1,
    second: () => this.movableIndexes.second,
    third: () => this.movableIndexes.third,
    fourth: () => this.pageCount
  };

  constructor(private vocabularySearchService: VocabularySearchService) { }

  concepts: Concept[] = [];

  ngOnInit(): void {
    this.makeRequest({
      pageSize: 100,
      pageNumber: 1
    });
  }

  get paginationSpacer() {
    if (this.pageCount < 5) {
      return PaginationSpacer.NONE;
    } else if (this.currentPage > this.pageCount / 2) {
      return PaginationSpacer.LEFT;
    } else {
      return PaginationSpacer.RIGHT;
    }
  }

  makeRequest(params: VocabSearchReqParams) {
    return this.vocabularySearchService.search(params)
      .subscribe(result => {
        this.pageCount = result.totalPages;
        this.concepts = result.content;
      });
  }

  handleNavigation($event: MouseEvent) {
    const dataset = ($event.target as HTMLElement).dataset;
    const getPage = this.pageNumberRecognizer[dataset.page];
    const page = getPage ? getPage() : null;
    const arrow = dataset.arrow;

    if (page && page !== this.currentPage) {
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
    } else if (arrow) {
      if (arrow === 'left' && this.currentPage !== 1) {
        if (this.currentPage === this.movableIndexes.second && this.movableIndexes.second !== 2) {
          this.movableIndexes = {
            second: this.movableIndexes.second - 1,
            third: this.movableIndexes.third - 1
          };
        }
        this.currentPage--;
      } else if (arrow === 'right' && this.currentPage !== this.pageCount) {
        if (this.currentPage === this.movableIndexes.third && this.movableIndexes.third !== this.pageCount - 1) {
          this.movableIndexes = {
            second: this.movableIndexes.second + 1,
            third: this.movableIndexes.third + 1
          };
        }
        this.currentPage++;
      }
    }
  }
}
