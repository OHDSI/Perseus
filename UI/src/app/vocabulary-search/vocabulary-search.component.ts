import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  VocabSearchFilters,
  VocabSearchReqParams,
  VocabularySearchService
} from '../services/vocabulary-search.service';
import { Concept } from './concept';
import { Subject } from 'rxjs/internal/Subject';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';
import { parseHtmlError } from '../services/utilites/error';

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

  total = 0;

  requestInProgress = false;

  error: string;

  @ViewChild('keyWordInput')
  keyWordInput: ElementRef;

  @ViewChild('pageSizeInput')
  pageSizeInput: ElementRef;

  filters: {
    name: string,
    priority: number,
    color: string,
    values: {
      name: string,
      count: number,
      checked: boolean,
      disabled: boolean
    }[]
  }[] = [];

  openedFilter: string;

  selectedFilters = [];

  private requestParams: VocabSearchReqParams = {
    pageSize: 100,
    pageNumber: 1,
    query: ''
  };

  private pageNumberRecognizer = {
    first: () => 1,
    second: () => this.movableIndexes.second,
    third: () => this.movableIndexes.third,
    fourth: () => this.pageCount
  };

  private filtersRecognizer = {
    domain_id: {name: 'Domain', priority: 1, color: '#761C1C'},
    standard_concept: {name: 'Concept', priority: 2, color: '#406C95'},
    concept_class_id: {name: 'Class', priority: 3, color: '#14772A'},
    vocabulary_id: {name: 'Vocab', priority: 4, color: '#E99A00'},
    invalid_reason: {name: 'Valid', priority: 5, color: '#3D00BD'}
  };

  private request$ = new Subject<{
    params: VocabSearchReqParams,
    updateFilters: boolean
  }>();

  constructor(private vocabularySearchService: VocabularySearchService) {
    super();
  }

  ngOnInit(): void {
    this.subscribeOnRequests();

    this.makeRequest(this.requestParams, true);
  }

  makeRequest(params: VocabSearchReqParams, updateFilters: boolean) {
    if (!this.requestInProgress) {
      this.requestInProgress = true;
    }
    this.request$.next({
      params,
      updateFilters
    });
  }

  handleNavigation($event: MouseEvent) {
    const dataset = ($event.target as HTMLElement).dataset;

    let doRequest = false;

    if (dataset.arrow) {
      doRequest = this.handleArrowNavigation(dataset.arrow);
    } else {
      const getPage = this.pageNumberRecognizer[dataset.page];
      const page = getPage ? getPage() : null;

      if (page && page !== this.currentPage) {
        doRequest = this.handlePageNavigation(page);
      }
    }

    if (doRequest) {
      this.makeRequest({
        ...this.requestParams,
        pageNumber: this.currentPage
      }, false);
    }
  }

  @HostListener('document:keyup.enter')
  onEnterClick() {
    const changes = this.findChanges();

    if (changes) {
      const {query, pageSize} = changes;
      const updateFilters = this.requestParams.query !== query;

      this.requestParams = {
        ...this.requestParams,
        pageSize,
        query
      };
      this.makeRequest(this.requestParams, updateFilters);
    }
  }

  onOpen(filter: string) {
    if (this.openedFilter === filter) {
      this.openedFilter = null;
    } else {
      this.openedFilter = filter;
    }
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
    let updateFilters = false;

    this.request$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(value => updateFilters = value.updateFilters),
        switchMap(value => this.vocabularySearchService.search(value.params))
      )
      .subscribe(result => {
        this.concepts = result.content;
        if (this.total !== result.totalElements) {
          this.total = result.totalElements;
          this.pageCount = result.totalPages;
        }
        if (updateFilters) {
          this.updateFilters(result.facets);
        }
        this.error = null;
        this.requestInProgress = false;
      }, error => {
        this.concepts = [];
        this.total = 0;
        this.error = parseHtmlError(error);
        this.requestInProgress = false;
      });
  }

  private findChanges(): { query: string, pageSize: number } {
    const query = this.keyWordInput.nativeElement.value;
    const pageSize = parseInt(this.pageSizeInput.nativeElement.value, 10);

    if (this.requestParams.query !== query || this.requestParams.pageSize !== pageSize) {
      return {
        query,
        pageSize
      };
    }

    return null;
  }

  private updateFilters(facets: VocabSearchFilters) {
    this.filters = Object.keys(facets)
      .map(filterKey => {
        const filter = this.filtersRecognizer[filterKey];
        const filterValue = facets[filterKey];
        return {
          name: filter.name as string,
          priority: filter.priority as number,
          color: filter.color as string,
          values: Object.keys(filterValue)
            .map(valueKey => ({
              name: valueKey,
              count: filterValue[valueKey] as number,
              checked: false,
              disabled: (filterValue[valueKey] as number) === 0
            }))
        };
      })
      .sort(filter => filter.priority);
  }
}
