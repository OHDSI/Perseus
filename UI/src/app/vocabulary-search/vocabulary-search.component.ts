import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { VocabularySearchService } from '@services/athena/vocabulary-search.service';
import { Concept } from '@models/vocabulary-search/concept';
import { of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { VocabularySearchStateService } from '@services/athena/vocabulary-search-state.service';
import { Column, Sort } from '@models/grid/grid';
import { NavigationGridComponent } from '@grid/navigation-grid/navigation-grid.component';
import { Pagination } from '@models/grid/pagination';
import { SearchInputComponent } from '@shared/search-input/search-input.component';
import {
  VocabSearchFilters,
  VocabSearchMode,
  VocabSearchReqParams,
  VocabSearchResult
} from '@models/vocabulary-search/vocabulray-search';
import { Filter, FilterValue } from '@models/filter/filter';
import { parseHttpError } from '@utils/error'

@Component({
  selector: 'app-vocabulary-search',
  templateUrl: './vocabulary-search.component.html',
  styleUrls: ['./vocabulary-search.component.scss']
})
export class VocabularySearchComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  concepts: Concept[] = []

  pageSize = 10

  total = 0

  requestInProgress = false

  disableAll = false

  columns: Column[] = [
    {field: 'id', name: 'ID', className: 'id'},
    {field: 'code', name: 'Code', className: 'code'},
    {field: 'name', name: 'Name', className: 'name', sortable: true},
    {field: 'className', name: 'Class', className: 'class', sortable: true},
    {field: 'standardConcept', name: 'Concept', className: 'concept', sortable: true},
    {field: 'invalidReason', name: 'Validity', className: 'validity', sortable: true},
    {field: 'domain', name: 'Domain', className: 'domain', sortable: true},
    {field: 'vocabulary', name: 'Vocab', className: 'vocab', sortable: true}
  ]

  @ViewChild(SearchInputComponent)
  keyWordInput: SearchInputComponent

  @ViewChild(NavigationGridComponent)
  gridComponent: NavigationGridComponent<Concept>

  filters: Filter[] = []

  oldSelectedFilters: string[] = [] // Only names
  selectedFilters: FilterValue[] = []

  chipsHeight = ''

  requestParams: VocabSearchReqParams = {
    pageSize: 10,
    pageNumber: 1,
    query: '',
    updateFilters: true
  }

  mode = VocabSearchMode.LOCAL

  @Input()
  bottom = '0'

  @Output()
  close = new EventEmitter<void>()

  error: string | null = null

  private filtersRecognizer = {
    domain_id: {name: 'Domain', priority: 1, color: '#761C1C'},
    standard_concept: {name: 'Concept', priority: 2, color: '#406C95'},
    concept_class_id: {name: 'Class', priority: 3, color: '#14772A'},
    vocabulary_id: {name: 'Vocab', priority: 4, color: '#E99A00'},
    invalid_reason: {name: 'Valid', priority: 5, color: '#3D00BD'}
  }

  private sortFieldMap = {
    id: 'concept_id',
    code: 'concept_code',
    name: 'concept_name',
    className: 'concept_class_id',
    standardConcept: 'standard_concept',
    invalidReason: 'invalid_reason',
    domain: 'domain_id',
    vocabulary: 'vocabulary_id'
  }

  private request$ = new Subject<VocabSearchReqParams>()

  private readonly chipHeight = 78

  private readonly maxPageSize = 500

  constructor(private searchService: VocabularySearchService,
              private stateService: VocabularySearchStateService) {
    super();
  }

  get isAthenaMode(): boolean {
    return this.mode === VocabSearchMode.ATHENA
  }

  ngOnInit(): void {
    this.subscribeOnRequests();

    const needRequest = !this.loadState();
    if (needRequest) {
      this.makeRequest(this.requestParams);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadGridParams()
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.saveState();
  }

  @HostListener('document:keyup.enter')
  onEnterOrApply() {
    const changes = this.findChanges();
    const filtersChanged = this.isFilterChanged();

    if (changes) {
      const {query, pageSize} = changes;

      this.setPageSizeAndQuery(query, pageSize);
    }

    if (filtersChanged) {
      this.setFilters();
    }

    if (changes || filtersChanged) {
      this.makeRequest(this.requestParams);
    }
  }

  onSort(sort: Sort) {
    this.requestParams = {
      ...this.requestParams,
      sort: this.sortFieldMap[sort.field],
      order: sort.order,
      updateFilters: false
    };
    this.makeRequest(this.requestParams);
  }

  onPagination(pagination: Pagination) {
    this.makeRequest({
      ...this.requestParams,
      pageNumber: pagination.pageNumber,
      updateFilters: false
    });
  }

  chipBackgroundColor(filterIndex: number) {
    const field = this.filters[filterIndex].field;
    return this.filtersRecognizer[field].color;
  }

  onCheckFilter(selectedFilters: FilterValue[]) {
    this.selectedFilters = selectedFilters;
    this.updateChipsHeight();
  }

  onDeleteFilter(index: number) {
    this.selectedFilters.splice(index, 1);

    this.updateChipsHeight();
  }

  onClear() {
    if (this.selectedFilters.length > 0) {
      this.selectedFilters = [];
      this.updateChipsHeight();

      this.setFilters();
      this.makeRequest(this.requestParams);
    }
  }

  onModeChange(value: string) {
    this.mode = value as VocabSearchMode;
    this.makeRequest(this.requestParams);
  }

  onClose() {
    this.close.emit();
  }

  private makeRequest(params: VocabSearchReqParams) {
    this.error = null;
    if (!this.requestInProgress) {
      this.requestInProgress = true;
    }
    this.request$.next(params);
  }

  private subscribeOnRequests() {
    const searchRequest = (params: VocabSearchReqParams) =>
      this.searchService.search(params, this.mode)
        .pipe(
          catchError(error => {
            this.disableAll = true
            this.error = parseHttpError(error)
            return of({
              content: [],
              totalPages: 1,
              totalElements: 0
            } as VocabSearchResult);
          })
        );

    let updateFilters = false;

    this.request$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(params => updateFilters = params.updateFilters),
        switchMap(params => searchRequest(params))
      )
      .subscribe(result => {
        this.concepts = result.content;
        this.gridComponent.setPagesAndElementsCount(result.totalElements, result.totalPages);
        if (updateFilters && result.facets) {
          this.updateFilters(result.facets);
        }
        if (this.concepts.length > 0) {
          this.disableAll = false;
        }
        this.requestInProgress = false;
      });
  }

  private findChanges(): { query: string, pageSize: number } {
    const query = this.keyWordInput.value;
    const pageSize = this.gridComponent.pageSize

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
      .sort((key1, key2) =>
        this.filtersRecognizer[key1].priority - this.filtersRecognizer[key2].priority
      )
      .map((filterKey, filterIndex) => {
        const filter = this.filtersRecognizer[filterKey];
        const filterValue = facets[filterKey];

        return {
          name: filter.name as string,
          field: filterKey,
          color: filter.color as string,
          values: Object.keys(filterValue)
            .map(valueKey => {
              const oldFilterValue = this.filters[filterIndex]?.values.find(value => value.name === valueKey);

              if (oldFilterValue) {
                oldFilterValue.count = filterValue[valueKey] as number;
                oldFilterValue.disabled = oldFilterValue.count === 0;
                return oldFilterValue;
              } else {
                return {
                  name: valueKey,
                  filterIndex,
                  count: filterValue[valueKey] as number,
                  disabled: (filterValue[valueKey] as number) === 0
                }
              }
            })
        };
      })
  }

  private updateChipsHeight() {
    const height = this.selectedFilters.length * this.chipHeight;
    this.chipsHeight = `${height}px`;
  }

  private setFilters() {
    this.saveOldFilters();

    const getConcreteFiltersByIndex = index => this.selectedFilters
      .filter(filter => filter.filterIndex === index)
      .map(filter => filter.name);

    this.requestParams = {
      ...this.requestParams,
      domain: getConcreteFiltersByIndex(0),
      standardConcept: getConcreteFiltersByIndex(1),
      conceptClass: getConcreteFiltersByIndex(2),
      vocabulary: getConcreteFiltersByIndex(3),
      invalidReason: getConcreteFiltersByIndex(4),
      updateFilters: true
    };
  }

  private loadState(): boolean {
    if (this.stateService.state) {
      const {requestParams, mode, selectedFilters, concepts, filters, pageSize} = this.stateService.state;
      this.requestParams = requestParams;
      this.mode = mode;
      this.selectedFilters = selectedFilters;
      this.concepts = concepts;
      this.filters = filters;
      this.pageSize = pageSize;
      this.updateChipsHeight();

      return true;
    }

    return false;
  }

  private loadGridParams() {
    if (this.stateService.state) {
      const {currentPage, pageCount, movableIndexes, sort, total} = this.stateService.state;
      this.gridComponent.currentPage = currentPage;
      this.gridComponent.movableIndexes = movableIndexes;
      this.gridComponent.sortParams = sort;
      this.gridComponent.setPagesAndElementsCount(total, pageCount)
      this.gridComponent.cdr.markForCheck()
    }
  }

  private saveState() {
    if (this.concepts.length > 0) {
      this.stateService.state = {
        requestParams: this.requestParams,
        mode: this.mode,
        selectedFilters: this.selectedFilters,
        concepts: this.concepts,
        currentPage: this.gridComponent.currentPage,
        pageCount: this.gridComponent.pageCount,
        pageSize: this.gridComponent.pageSize,
        filters: this.filters,
        movableIndexes: this.gridComponent.movableIndexes,
        sort: this.gridComponent.sortParams,
        total: this.gridComponent.total
      };
    }
  }

  private setPageSizeAndQuery(query: string, pageSize: number) {
    const updateFilters = this.requestParams.query !== query;

    let checkedPageSize: number;
    if (!pageSize || pageSize < 1) {
      checkedPageSize = 1;
    } else if (pageSize > this.maxPageSize) {
      checkedPageSize = this.maxPageSize;
    } else {
      checkedPageSize = pageSize;
    }

    this.requestParams = {
      ...this.requestParams,
      pageSize: checkedPageSize,
      query,
      updateFilters
    };
  }

  private isFilterChanged() {
    const equal = (oldFilters: string[], newFilters: FilterValue[]) =>
      oldFilters.length === newFilters.length &&
      oldFilters.every((name, index) => name === newFilters[index].name)

    return !equal(this.oldSelectedFilters, this.selectedFilters);
  }

  private saveOldFilters() {
    this.oldSelectedFilters = this.selectedFilters
      .map(filter => filter.name);
  }
}
