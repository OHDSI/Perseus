import { CdkDrag, CdkDragMove, CdkDragStart, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { merge, Subscription } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Command } from 'src/app/infrastructure/command';
import { uniq, uniqBy } from 'src/app/infrastructure/utility';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';
import { IVocabulary, VocabulariesService } from 'src/app/services/vocabularies.service';
import { Area } from '@models/area';
import { CommonUtilsService } from '@services/common-utils.service';
import { OverlayConfigOptions } from '@services/overlay/overlay-config-options.interface';
import { OverlayService } from '@services/overlay/overlay.service';
import { StoreService } from '@services/store.service';
import { UploadService } from '@services/upload.service';
import { Criteria } from '@shared/search-by-name/search-by-name.component';
import { CdmFilterComponent } from '@popups/cdm-filter/cdm-filter.component';
import { SqlEditorComponent } from '@app/shared/sql-editor/sql-editor.component';
import { DataService } from 'src/app/services/data.service';
import * as cdmTypes from '../../popups/cdm-filter/CdmByTypes.json';
import { BaseComponent } from '@shared/base/base.component';
import { VocabularyObserverService } from '@services/athena/vocabulary-observer.service';
import { mainPageRouter } from '@app/app.constants';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { State } from '@models/state';
import { asc } from '@utils/sort';
import { isTablesMapped, isTablesMappedOrViewCreated } from '@utils/mapping-util';
import { openErrorDialog, parseHttpError } from '@utils/error'
import { PerseusApiService } from '@services/perseus/perseus-api.service'
import { SqlEditorData } from '@shared/sql-editor/sql-editor.data'
import { ITable } from '@models/table'
import { DeleteWarningComponent } from '@popups/delete-warning/delete-warning.component'
import { TargetConfig } from '@models/target-config'

@Component({
  selector: 'app-comfy',
  templateUrl: './comfy.component.html',
  styleUrls: ['./comfy.component.scss']
})
export class ComfyComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  get state(): State {
    return this.storeService.state;
  }

  get cdmVersions(): string[] {
    return this.state.cdmVersions
  }

  get vocabularyBottom(): string {
    return this.actionVisible ? '80px' : '0';
  }

  get actionVisible(): boolean {
    return this.data.source?.length > 0 && this.data.target?.length > 0
  }

  get resetMappingDisabled(): boolean {
    return !isTablesMappedOrViewCreated(this.targetConfig, this.data.source)
  }

  get gotToLinkFieldsDisabled(): boolean {
    return !isTablesMapped(this.targetConfig)
  }

  constructor(
    public commonUtilsService: CommonUtilsService,
    public bridgeService: BridgeService,
    public uploadService: UploadService,
    private vocabulariesService: VocabulariesService,
    private storeService: StoreService,
    private snackBar: MatSnackBar,
    private router: Router,
    private overlayService: OverlayService,
    private dataService: DataService,
    private matDialog: MatDialog,
    private element: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private vocabularyObserverService: VocabularyObserverService,
    private perseusApiService: PerseusApiService
  ) {
    super();
  }

  dropTargetId: string;
  targetTableNames: string[] = [];
  highlightedTables: string[] = [];

  source: string[] = [];
  target: ITable[] = [];
  targetConfig: TargetConfig = {};
  sourceConnectedTo = [];
  allSourceRows: IRow[] = [];
  uniqSourceRows: IRow[] = [];
  sourceFocusedElement;
  speed = 5;
  subs = new Subscription();

  vocabularies: IVocabulary[] = [];
  data: State = {
    source: [],
    target: [],
    targetConfig: {},
    filteredTables: undefined,
    linkTablesSearch: {
      source: undefined,
      target: undefined,
      sourceColumns: undefined
    }
  };

  isVocabularyVisible: boolean;

  mappingHeight = '100%';
  columnListHeight = '100%';

  @ViewChild('scrollEl', {static: false}) scrollEl: ElementRef<HTMLElement>;
  @ViewChild('sourceUpload', {static: false}) fileInput: ElementRef<HTMLElement>;
  @ViewChildren(CdkDrag) dragEls: QueryList<CdkDrag>;
  @ViewChild('mappingUpload', {static: false}) mappingInput: ElementRef;

  drop = new Command({
    execute: (event: CdkDragDrop<string[], string[]>) => {
      const {container: currentContainer, previousContainer, previousIndex, currentIndex} = event;
      const [currentArea] = currentContainer.id.split('-');
      const [previousArea] = previousContainer.id.split('-');

      const stayInTheSameArea = currentArea === previousArea;
      const targetTableName = currentContainer.data[0];
      const userMapsNewTableFromSourceToTarget = this.targetTableIsLinkable(targetTableName) && !currentContainer.data.slice(1).includes(previousContainer.data[previousIndex]);

      if (stayInTheSameArea) {
        if (currentArea === Area.Target) {
          // When user sort source or target tables
          const draggedItemId = event.item.element.nativeElement.id;
          const nodes = this.element.nativeElement.querySelectorAll('.vertical-list-item');
          const prevInd = Array.from(nodes).findIndex((it: any) => it.id === `node-${draggedItemId}`);
          const curInd = Array.from(nodes).findIndex((it: any) => it.id === `node-${this.dropTargetId}`);
          const prevTargetIndex = this.storeService.state.target.findIndex(item => item.name === this.targetTableNames[prevInd]);
          const curTargetIndex = this.storeService.state.target.findIndex(item => item.name === this.targetTableNames[curInd]);
          moveItemInArray(this.targetTableNames, prevInd, curInd);
          moveItemInArray(this.storeService.state.target, prevTargetIndex, curTargetIndex);
        }

        if (currentArea === Area.Source) {
          if (previousIndex !== currentIndex) {
            moveItemInArray(currentContainer.data, previousIndex, currentIndex);
            moveItemInArray(this.storeService.state.source, previousIndex, currentIndex);
          }
        }
      } else if (userMapsNewTableFromSourceToTarget) {
        // First element - target table name excluded
        copyArrayItem(previousContainer.data, currentContainer.data, previousIndex, currentContainer.data.length);
        this.storeService.add('targetConfig', {...this.targetConfig});
        this.storeService.state.recalculateSimilar = true;
      }
    }
  });

  public addLinkableClass(tableName: string): string {
    return this.targetTableIsLinkable(tableName) ? 'linkable-box' : 'non-linkable-box';
  }

  private targetTableIsLinkable(tableName: string): boolean {
    const autogeneratedTables = (cdmTypes as any).default['Derived Elements'];
    return !autogeneratedTables.includes(tableName.toUpperCase());
  }

  private animationFrame: number | undefined;

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!event) {
      return;
    }
    const target = event.target;
    if (!target || !this.sourceFocusedElement) {
      return;
    }
    const clickedOutside = !this.sourceFocusedElement.contains(target);
    if (clickedOutside) {
      this.unsetSourceFocus();
    }
  }

  ngOnInit() {
    this.vocabularies = this.vocabulariesService.vocabularies;

    this.perseusApiService.getCDMVersions().subscribe(res => {
      res = res.sort((a, b) => (a > b ? -1 : 1));
      this.storeService.add('cdmVersions', res);
    });

    this.storeService.state$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(state => this.initializeData(state))

    this.subscribeOnVocabularyOpening();
  }

  ngAfterViewInit() {
    const onMove$ = this.dragEls.changes.pipe(
      startWith(this.dragEls),
      map((d: QueryList<CdkDrag>) => d.toArray()),
      map(dragels => dragels.map(drag => drag.moved)),
      switchMap(obs => merge(...obs)),
      tap(this.triggerScroll)
    );

    this.subs.add(onMove$.subscribe());

    const onDown$ = this.dragEls.changes.pipe(
      startWith(this.dragEls),
      map((d: QueryList<CdkDrag>) => d.toArray()),
      map(dragels => dragels.map(drag => drag.ended)),
      switchMap(obs => merge(...obs)),
      tap(this.cancelScroll)
    );

    this.subs.add(onDown$.subscribe());
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    this.subs.unsubscribe();
  }

  dragMoved(event) {
    const e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    const container = e?.classList.contains('vertical-list-item') ? e : e?.closest('.vertical-list-item');
    this.dropTargetId = container ? container.getAttribute('data-id') : undefined;
  }

  @bound
  public triggerScroll($event: CdkDragMove) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.animationFrame = requestAnimationFrame(() => this.scroll($event));
  }

  @bound
  private cancelScroll() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }

  private scroll($event: CdkDragMove) {
    const {y} = $event.pointerPosition;
    if (!this.scrollEl) {
      return;
    }
    const baseEl = this.scrollEl.nativeElement;
    const box = baseEl.getBoundingClientRect();
    const scrollTop = baseEl.scrollTop;
    const top = box.top + -y;
    if (top > 0 && scrollTop !== 0) {
      baseEl.scrollTop = scrollTop - this.speed * Math.exp(top / 50);
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
      return;
    }

    const bottom = y - box.bottom;
    if (bottom > 0 && scrollTop < box.bottom) {
      baseEl.scrollTop = scrollTop + this.speed * Math.exp(bottom / 50);
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
    }
  }

  private initializeSourceData() {
    this.source = [];
    this.source = uniq(
      this.data.source
        .map(table => table.name)
    );
    this.filterAtInitialization('source', this.data.linkTablesSearch.source);
  }

  private initializeTargetData() {
    this.target = this.data.target;
    this.targetConfig = this.data.targetConfig;
    this.targetTableNames = this.data.target.map(table => table.name);
    this.sourceConnectedTo = this.data.target.map(table => `target-${table.name}`);

    if (this.data.filteredTables) {
      this.filterByType();
    }
    this.filterAtInitialization('target', this.data.linkTablesSearch.target);
  }

  private initializeSourceColumns() {
    if (!this.data.source.length) {
      return;
    }
    const allViews = this.data.source.filter(item => item.sql).map(item => item.name);
    const allColumns = this.data.source.reduce((prev, cur) => {
      let ar = [];
      if (!allViews.includes(cur.name)) {
        cur.rows.forEach(item => {
          item.grouppedFields.length > 0 ? ar = ar.concat(item.grouppedFields) : ar.push(item);
        });
      }
      return prev.concat(ar);
    }, []);
    this.allSourceRows = allColumns.sort((r1, r2) => asc(r1.name, r2.name));
    this.uniqSourceRows = uniqBy(this.allSourceRows, 'name');
    this.filterAtInitialization('source-column', this.data.linkTablesSearch.sourceColumns);
  }

  private initializeData(state: State) {
    this.data = state;
    this.initializeSourceData();
    this.initializeTargetData();
    this.initializeSourceColumns();
  }

  openCdmVersion(version: string) {
    return this.dataService.setCdmVersionAndGetTargetData(version)
      .subscribe(
        () => this.snackBar.open('Target schema loaded', ' DISMISS '),
        error => openErrorDialog(this.matDialog, 'Can not load target schema', parseHttpError(error))
      )
  }

  afterOpenMapping(event?: any) {
    if (!event || event.index !== 0)
      this.router.navigate([`${mainPageRouter}/mapping`], { queryParams: event });
  }

  getMappingConfig() {
    const mappingConfig = [];
    Object.keys(this.targetConfig).forEach(key => {
      const item = this.targetConfig[key].data;
      if (item.length > 1) {
        mappingConfig.push(item);
      }
    });

    return mappingConfig;
  }

  findTables(selectedSourceColumns: string[]): void {
    if (selectedSourceColumns.length) {
      const indexes = {};
      const tableIncludesColumns = (arr, target) => target.every(v => arr.includes(v));

      this.data.source.forEach(table => {

        let rowNames = [];
        table.rows.forEach(item => {
          item.grouppedFields.length > 0 ? rowNames = rowNames.concat(item.grouppedFields) : rowNames.push(item);
        });

        indexes[table.name] = tableIncludesColumns(rowNames.map(item => item.name), selectedSourceColumns);
      });

      this.highlightedTables = Object.keys(indexes).filter(tableName => indexes[tableName]);

      this.source = Object.assign([], this.source);
    } else {
      this.highlightedTables = [];
    }
  }

  removeTableMapping(
    sourceTableName: string,
    targetTableName: string,
    event?: any
  ) {
    if (event) {
      event.stopPropagation();
    }

    const mappedSourceTables = this.targetConfig[targetTableName].data;
    const index = mappedSourceTables.findIndex(tablename => tablename === sourceTableName);
    if (index > -1) {
      mappedSourceTables.splice(index, 1);
      this.storeService.add('targetConfig', {...this.targetConfig})
    }

    const targetClones = this.storeService.state.targetClones
    if (targetClones[targetTableName]) {
      delete targetClones[targetTableName];
      this.storeService.add('targetClones', {...targetClones})
    }

    const concepts = this.storeService.state.concepts
    if (concepts[`${targetTableName}|${sourceTableName}`]) {
      delete concepts[`${targetTableName}|${sourceTableName}`];
      this.storeService.add('concepts', {...concepts})
    }

    this.bridgeService.deleteArrowsForMapping(
      targetTableName,
      sourceTableName
    );
  }

  filterByName(area: string, byName: Criteria): void {
    const filterByName = (name) => {
      return name.toUpperCase().indexOf(byName.criteria.toUpperCase()) > -1;
    };

    switch (area) {
      case Area.Source: {
        this.source = this.data.source.map(item => item.name).filter(filterByName);
        this.data.linkTablesSearch.source = byName.criteria;
        break;
      }
      case Area.Target: {
        this.targetTableNames = this.data.target.map(item => item.name).filter(filterByName);
        this.data.linkTablesSearch.target = byName.criteria;
        break;
      }
      case Area.SourceColumn: {
        const rows = this.data.source.reduce((prev, cur) => [...prev, ...cur.rows], []);
        this.uniqSourceRows = uniqBy(rows, 'name').filter(row => filterByName(row.name));
        this.data.linkTablesSearch.sourceColumns = byName.criteria;
        break;
      }
      default:
        break;
    }
  }

  filterAtInitialization(area: string, filterCriteria: string) {
    if (filterCriteria) {
      const searchCriteria: Criteria = {
        filtername: 'by-name',
        criteria: filterCriteria
      };
      this.filterByName(area, searchCriteria);
    }
  }

  filterByType(): void {
    const uniqueTargetNames = this.data.target.map(item => item.name);
    const {items: selectedTables} = this.data.filteredTables;
    if (selectedTables.length === 0) {
      this.targetTableNames = uniqueTargetNames;
      return;
    }
    const filterByType = (name) => !!selectedTables.find(x => x === name.toUpperCase());
    this.targetTableNames = uniqueTargetNames.filter(filterByType);
  }

  filterByNameReset(area: string): void {
    switch (area) {
      case Area.Source: {
        this.data.linkTablesSearch.source = '';
        this.initializeSourceData();
        break;
      }
      case Area.Target: {
        this.data.linkTablesSearch.target = '';
        this.initializeTargetData();
        break;
      }
      case Area.SourceColumn: {
        this.data.linkTablesSearch.sourceColumns = '';
        this.initializeSourceColumns();
        break;
      }
      default:
        break;
    }
  }

  openFilter(target) {
    const types = this.data.filteredTables ? this.data.filteredTables.types : [];
    const checkedTypes = this.data.filteredTables ? this.data.filteredTables.checkedTypes : [];
    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'filter-popup',
      payload: {
        title: 'Target tables',
        saveKey: 'filteredTables',
        types,
        checkedTypes,
        options: (cdmTypes as any).default
      }
    };
    this.overlayService.open(dialogOptions, target, CdmFilterComponent);
  }

  openSqlDialog(data: SqlEditorData) {
    return this.matDialog.open(SqlEditorComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'sql-editor-dialog',
      data
    });
  }

  openCreateSqlDialog() {
    const matDialog = this.openSqlDialog({tables: this.data.source, action: 'Create'});

    matDialog.afterClosed().subscribe(res => {
        if (res) {
          this.storeService.add(Area.Source, [res, ...this.data.source]);
        }
      }
    );
  }

  openEditSqlDialog(name) {
    const table = this.findSourceTableByName(name);
    const matDialog = this.openSqlDialog({tables: this.data.source, table, action: 'Edit'});

    matDialog.afterClosed().subscribe(res => {
      if (res) {
        this.storeService.updateTable(Area.Source, table, res);
      }
    });
  }

  openDeleteViewDialog(tableName) {
    const dialogRef = this.matDialog.open(DeleteWarningComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog',
      data: {
        title: 'View',
        message: 'You want to delete the view'
      },
      width: '270px',
      height: '235px'
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const table = this.findSourceTableByName(tableName);
        this.storeService.removeTable(Area.Source, table);
        Object.keys(this.targetConfig).forEach(source => {
          if (this.targetConfig[source].data.includes(tableName)) {
            this.removeTableMapping(tableName, source);
          }
        });
      }
    });

  }

  isEditable(tableName: string): boolean {
    const table = this.findSourceTableByName(tableName);
    return !!table?.sql;
  }

  findSourceTableByName(name: string): ITable | undefined {
    return this.data.source.find(table => table.name === name)
  }

  unsetSourceFocus() {
    const focused: HTMLAllCollection = this.element.nativeElement.querySelectorAll('.source-focus');
    Array.from(focused).forEach((it: HTMLElement) => it.classList.remove('source-focus'));
    this.sourceFocusedElement = undefined;
  }

  onSourceClick($event: MouseEvent) {
    $event.stopPropagation();
    this.setSourceFocus($event.currentTarget);
  }

  onSourceDrag($event: CdkDragStart) {
    this.setSourceFocus($event.source.element.nativeElement);
  }

  setSourceFocus(target) {
    if (target) {
      this.unsetSourceFocus();
      this.sourceFocusedElement = target;
      this.sourceFocusedElement.classList.add('source-focus');
    }
  }

  showVocabulary() {
    this.isVocabularyVisible = !this.isVocabularyVisible;
    this.setTableMappingAndColumnListHeights();
    this.vocabularyObserverService.next({
      value: this.isVocabularyVisible,
      emit: false
    })
  }

  private setTableMappingAndColumnListHeights() {
    if (this.actionVisible) {
      if (this.isVocabularyVisible) {
        this.mappingHeight = 'calc(100% - 470px)';
        this.columnListHeight = 'calc(100% - 420px)';
      } else {
        this.mappingHeight = '100%';
        this.columnListHeight = '100%';
      }
    }
  }

  private subscribeOnVocabularyOpening() {
    this.vocabularyObserverService.show$.subscribe(visible => {
      this.isVocabularyVisible = visible;
      this.setTableMappingAndColumnListHeights();
    })
  }
}

export function bound(target: object, propKey: string | symbol) {
  const originalMethod = (target as any)[propKey] as Function;

  // Ensure the above type-assertion is valid at runtime.
  if (typeof originalMethod !== 'function') {
    throw new TypeError('@bound can only be used on methods.');
  }

  if (typeof target === 'function') {
    // Static method, bind to class (if target is of type 'function', the method decorator was used on a static method).
    return {
      value() {
        return originalMethod.apply(target, arguments);
      }
    };
  } else if (typeof target === 'object') {
    // Instance method, bind to instance on first invocation (as that is the only way to access an instance from a decorator).
    return {
      get() {
        // Create bound override on object instance.
        // This will hide the original method on the prototype, and instead yield a bound version from the instance itself.
        // The original method will no longer be accessible. Inside a getter, 'this' will refer to the instance.
        const instance = this;

        Object.defineProperty(instance, propKey.toString(), {
          value() {
            // This is effectively a lightweight bind() that skips many (here unnecessary) checks found in native implementations.
            return originalMethod.apply(instance, arguments);
          }
        });

        // The first invocation (per instance) will return the bound method from here.
        // Subsequent calls will never reach this point, due to the way
        // JavaScript runtimes look up properties on objects; the bound method, defined on the instance, will effectively hide it.
        return instance[propKey];
      }
    } as PropertyDescriptor;
  }
}
