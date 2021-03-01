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
import { Filter } from './filter-item/filter-item.component';
import { FilterValue } from './filter-list/filter-list.component';

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

  columns = [
    {field: 'id', name: 'ID', className: 'id'},
    {field: 'code', name: 'Code', className: 'code'},
    {field: 'name', name: 'Name', className: 'name'},
    {field: 'className', name: 'Class', className: 'class'},
    {field: 'standardConcept', name: 'Concept', className: 'concept'},
    {field: 'invalidReason', name: 'Validity', className: 'validity'},
    {field: 'domain', name: 'Domain', className: 'domain'},
    {field: 'vocabulary', name: 'Vocab', className: 'vocab'}
  ];

  sort: {
    field: string;
    order: string
  };

  @ViewChild('keyWordInput')
  keyWordInput: ElementRef;

  @ViewChild('pageSizeInput')
  pageSizeInput: ElementRef;

  filters: Filter[] = [];

  openedFilter: string;

  selectedFilters: FilterValue[] = [];

  chipsHeight = '';

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

  private sortFieldMap = {
    id: 'concept_id',
    code: 'concept_code',
    name: 'concept_name',
    className: 'concept_class_id',
    standardConcept: 'standard_concept',
    invalidReason: 'invalid_reason',
    domain: 'domain_id',
    vocabulary: 'vocabulary_id'
  };

  private request$ = new Subject<{
    params: VocabSearchReqParams,
    updateFilters: boolean
  }>();

  private readonly chipHeight = 72;

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

  handleNavigation(event: MouseEvent) {
    const dataset = (event.target as HTMLElement).dataset;

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

  onSort(event: MouseEvent) {
    const field = (event.target as HTMLElement).dataset.sortField;

    if (field) {
      if (!this.sort || this.sort.field !== field || this.sort.order === 'desc') {
        this.sort = {
          field,
          order: 'asc'
        };
      } else {
        this.sort = {
          field,
          order: 'desc'
        };
      }

      this.requestParams = {
        ...this.requestParams,
        sort: this.sortFieldMap[this.sort.field],
        order: this.sort.order
      };
      this.makeRequest(this.requestParams, false);
    }
  }

  chipBackgroundColor(filterIndex: number) {
    const field = this.filters[filterIndex].field;
    return this.filtersRecognizer[field].color;
  }

  onCheckFilter(filterValue: FilterValue) {
    filterValue.checked = !filterValue.checked;

    if (filterValue.checked) {
      this.selectedFilters.push(filterValue);
    } else {
      const index = this.selectedFilters.indexOf(filterValue);
      this.selectedFilters.splice(index, 1);
    }

    this.updateChipsHeight();

    this.setFiltersAndMakeRequest();
  }

  onDeleteFilter(index: number) {
    this.selectedFilters[index].checked = false;
    this.selectedFilters.splice(index, 1);

    this.updateChipsHeight();

    this.setFiltersAndMakeRequest();
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
        this.setPagesAndElementsCount(result.totalElements, result.totalPages);
        if (updateFilters) {
          this.updateFilters(result.facets);
        }
        this.error = null;
        this.requestInProgress = false;
      }, error => {
        this.concepts = [];
        this.setPagesAndElementsCount(0, 1);
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
      .sort(filterKey => this.filtersRecognizer[filterKey].priority)
      .map((filterKey, filterIndex) => {
        const filter = this.filtersRecognizer[filterKey];
        const filterValue = facets[filterKey];
        return {
          name: filter.name as string,
          field: filterKey,
          color: filter.color as string,
          values: Object.keys(filterValue)
            .map(valueKey => ({
              name: valueKey,
              filterIndex,
              count: filterValue[valueKey] as number,
              checked: false,
              disabled: (filterValue[valueKey] as number) === 0
            }))
        };
      });
  }

  private updateChipsHeight() {
    const height = this.selectedFilters.length * this.chipHeight;
    this.chipsHeight = `${height}px`;
  }

  private setFiltersAndMakeRequest() {
    const getConcreteFiltersByIndex = index => this.selectedFilters
        .filter(filter => filter.filterIndex === index)
        .map(filter => filter.name);

    this.requestParams = {
      ...this.requestParams,
      domain: getConcreteFiltersByIndex(0),
      standardConcept: getConcreteFiltersByIndex(1),
      conceptClass: getConcreteFiltersByIndex(2),
      vocabulary: getConcreteFiltersByIndex(3),
      invalidReason: getConcreteFiltersByIndex(4)
    };

    this.makeRequest(this.requestParams, false);
  }

  private setPagesAndElementsCount(total: number, pageCount: number) {
    if (this.total !== total || this.pageCount !== pageCount) {
      this.total = total;
      this.pageCount = pageCount;

      if (this.currentPage > pageCount) {
        this.currentPage = pageCount;

        const second = pageCount - 2;
        const third = pageCount - 1;

        this.movableIndexes = {
          second: second > 1 ? second : 2,
          third: third > 2 ? third : 3
        };
      }
    }
  }
}
