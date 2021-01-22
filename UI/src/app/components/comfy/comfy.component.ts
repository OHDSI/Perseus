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
import { MappingPageSessionStorage } from 'src/app/models/implementation/mapping-page-session-storage';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';
import { IVocabulary, VocabulariesService } from 'src/app/services/vocabularies.service';
import { Area } from '../../models/area';
import { CommonUtilsService } from '../../services/common-utils.service';
import { CommonService } from '../../services/common.service';
import { OverlayConfigOptions } from '../../services/overlay/overlay-config-options.interface';
import { OverlayService } from '../../services/overlay/overlay.service';
import { StoreService } from '../../services/store.service';
import { UploadService } from '../../services/upload.service';
import { BaseComponent } from '../../common/components/base/base.component';
import { Criteria } from '../../common/components/search-by-name/search-by-name.component';
import { CdmFilterComponent } from '../popups/open-cdm-filter/cdm-filter.component';
import { SqlEditorComponent } from '../sql-editor/sql-editor.component';
import { DataService } from 'src/app/services/data.service';
import * as cdmTypes from '../popups/open-cdm-filter/CdmByTypes.json';
import { ScanDataDialogComponent } from '../../scan-data/scan-data-dialog/scan-data-dialog.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-comfy',
  templateUrl: './comfy.component.html',
  styleUrls: [ './comfy.component.scss' ]
})
export class ComfyComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  get state() {
    return this.storeService.state;
  }

  constructor(
    private vocabulariesService: VocabulariesService,
    private storeService: StoreService,
    private commonUtilsService: CommonUtilsService,
    private bridgeService: BridgeService,
    private snackBar: MatSnackBar,
    private router: Router,
    private mappingStorage: MappingPageSessionStorage,
    private uploadService: UploadService,
    private overlayService: OverlayService,
    private dataService: DataService,
    private matDialog: MatDialog,
    private commonService: CommonService,
    private element: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  dropTargetId: string;
  targetTableNames: string[] = [];
  highlightedTables: string[] = [];

  source: string[] = [];

  target = [];
  targetConfig = {};
  sourceConnectedTo = [];
  allSourceRows: IRow[] = [];
  uniqSourceRows: IRow[] = [];
  sourceFocusedElement;
  speed = 5;
  subs = new Subscription();
  private animationFrame: number | undefined;

  reportLoading$: Observable<boolean>;
  mappingLoading$: Observable<boolean>;

  vocabularies: IVocabulary[] = [];
  data = {
    source: [],
    target: [],
    targetConfig: {},
    version: undefined,
    filteredTables: undefined,
    linkTablesSearch: {
      source: undefined,
      target: undefined,
      sourceColumns: undefined
    }
  };

  @ViewChild('scrollEl', { static: false }) scrollEl: ElementRef<HTMLElement>;
  @ViewChild('sourceUpload', { static: false }) fileInput: ElementRef<HTMLElement>;
  @ViewChildren(CdkDrag) dragEls: QueryList<CdkDrag>;

  drop = new Command({
    execute: (event: any) => {
      const { container, previousContainer, previousIndex, currentIndex } = event;
      const data = container.data;
      const [ area ] = container.id.split('-');
      const [ previousArea ] = previousContainer.id.split('-');
      const exists = container.data.find(tableName => previousContainer.data[ previousIndex ] === tableName);

      if (area === previousArea) {
        if (area === Area.Target) {
          const draggedItemId = event.item.element.nativeElement.id;
          const nodes = this.element.nativeElement.querySelectorAll('.vertical-list-item');
          const prevInd = Array.from(nodes).findIndex((it: any) => it.id === `node-${draggedItemId}`);
          const curInd = Array.from(nodes).findIndex((it: any) => it.id === `node-${this.dropTargetId}`);
          const prevTargetIndex = this.storeService.state.target.findIndex(item => item.name === this.targetTableNames[ prevInd ]);
          const curTargetIndex = this.storeService.state.target.findIndex(item => item.name === this.targetTableNames[ curInd ]);
          moveItemInArray(this.targetTableNames, prevInd, curInd);
          moveItemInArray(this.storeService.state.target, prevTargetIndex, curTargetIndex);
        }

        if (area === Area.Source) {
          if (previousIndex !== currentIndex) {
            moveItemInArray(data, previousIndex, currentIndex);
            moveItemInArray(this.storeService.state.source, previousIndex, currentIndex);
          }
        }
      } else if (!exists) {
        copyArrayItem(previousContainer.data, data, previousIndex, data.length);
        this.storeService.add('targetConfig', this.targetConfig);
        this.storeService.state.recalculateSimilar = true;
      }
    }
  });

  @HostListener('document:click', [ '$event' ])
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

    this.dataService.getCDMVersions().subscribe(res => {
      res = res.sort((a, b) => (a > b ? -1 : 1));
      this.storeService.add('cdmVersions', res);
    });

    this.storeService.state$.subscribe(res => {
      if (res) {
        this.data = res;
        this.initializeData();
      }
    });

    this.bridgeService.applyConfiguration$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(configuration => this.dataService.saveSourceSchemaToDb(configuration.sourceTables)))
      .subscribe(res => {
        if (res === 'OK') {
          this.uploadService.mappingLoading = false;
          this.snackBar.open('Source schema has been loaded to database', ' DISMISS ');
        } else {
          this.snackBar.open('ERROR: Source schema has not been loaded to database!', ' DISMISS ');
        }
      }, () => this.uploadService.mappingLoading = false);

    this.bridgeService.resetAllMappings$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        Object.values(this.targetConfig).forEach((item: any) => {
          item.data = [ item.first ];
        });
        this.initializeData();

        this.snackBar.open('Reset all mappings success', ' DISMISS ');
      });

    this.bridgeService.saveAndLoadSchema$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        this.bridgeService.reportLoaded();
        this.initializeData();
        this.snackBar.open('New source schema loaded', ' DISMISS ');
      });

    this.reportLoading$ = this.bridgeService.reportLoading$;
    this.mappingLoading$ = this.uploadService.mappingLoading$;
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
    this.subs.unsubscribe();
  }

  dragMoved(event) {
    const e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    const container = e.classList.contains('vertical-list-item') ? e : e.closest('.vertical-list-item');
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
    const { y } = $event.pointerPosition;
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

  initializeSourceData() {
    this.source = [];
    this.source = uniq(
      this.data.source
        .map(table => table.name)
    );
    this.filterAtInitialization('source', this.data.linkTablesSearch.source);
  }

  initializeTargetData() {
    this.target = this.data.target;
    this.targetConfig = this.data.targetConfig;
    this.targetTableNames = this.data.target.map(table => table.name);

    this.sourceConnectedTo = this.data.target.map(table => `target-${table.name}`);

    if (this.data.filteredTables) {
      this.filterByType();
    }
    this.filterAtInitialization('target', this.data.linkTablesSearch.target);
  }

  initializeSourceColumns() {
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
    this.allSourceRows = allColumns;
    this.uniqSourceRows = uniqBy(allColumns, 'name');
    this.filterAtInitialization('source-column', this.data.linkTablesSearch.sourceColumns);
  }

  initializeData() {
    this.initializeSourceData();
    this.initializeTargetData();
    this.initializeSourceColumns();
  }

  openCdmVersion(version: string) {
    return this.dataService.getTargetData(version).subscribe();
  }

  async openMapping(event?: any) {
    if (!event || event.index !== 0)
      this.router.navigate(['/mapping'], { queryParams: event, skipLocationChange: true});
  }

  getMappingConfig() {
    const mappingConfig = [];
    Object.keys(this.targetConfig).forEach(key => {
      const item = this.targetConfig[ key ].data;
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

        indexes[ table.name ] = tableIncludesColumns(rowNames.map(item => item.name), selectedSourceColumns);
      });

      this.highlightedTables = Object.keys(indexes).filter(tableName => indexes[ tableName ]);

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

    const table = this.targetConfig[ targetTableName ];
    const { data } = table;

    const index = data.findIndex(tablename => tablename === sourceTableName);

    if (index > -1) {
      data.splice(index, 1);
    }

    if (this.storeService.state.targetClones[ targetTableName ]) {
      delete this.storeService.state.targetClones[ targetTableName ];
    }
    // previous version of remove mapping algorithm. Has been commented since logic with deleting links from all concept tables is not required
    /*     if (isConceptTable(targetTableName)) {
          environment.conceptTables.forEach(conceptTable => {
            this.bridgeService.deleteArrowsForMapping(
              conceptTable,
              sourceTableName
            );
          });
        } else {
          this.bridgeService.deleteArrowsForMapping(
            targetTableName,
            sourceTableName
          );
        } */

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
        const rows = this.data.source.reduce((prev, cur) => [ ...prev, ...cur.rows ], []);
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
    const { items: selectedTables } = this.data.filteredTables;
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

  loadNewReport() {
    this.uploadService.onFileInputClick(this.fileInput);
  }

  openSetCDMDialog() {
    this.commonUtilsService.openSetCDMDialog();
  }

  onFileUpload(event: Event) {
    this.bridgeService.reportLoading();
    this.uploadService.onFileChange(event);
  }

  openFilter(target) {
    const types = this.data.filteredTables ? this.data.filteredTables.types : [];
    const checkedTypes = this.data.filteredTables ? this.data.filteredTables.checkedTypes : [];
    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'filter-popup',
      payload: { title: 'Target tables', saveKey: 'filteredTables', types, checkedTypes, options: (cdmTypes as any).default }
    };
    this.overlayService.open(dialogOptions, target, CdmFilterComponent);
  }

  resetMapping() {
    this.commonUtilsService.resetMappingsWithWarning();
  }

  checkExistingMappings(): boolean {
    return !!this.targetTableNames.find(it => this.targetConfig[ it ]
      && this.targetConfig[ it ].data
      && this.targetConfig[ it ].data.length > 1);
  }

  openSqlDialog(data) {
    return this.matDialog.open(SqlEditorComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'sql-editor-dialog',
      data
    });
  }

  openCreateSqlDialog() {
    const matDialog = this.openSqlDialog({ tables: this.data.source, action: 'Create' });

    matDialog.afterClosed().subscribe(res => {
      if (res) {
        this.storeService.add(Area.Source, [ res, ...this.data.source ]);
      }
    }
    );
  }

  openEditSqlDialog(name) {
    const table = this.findSourceTableByName(name);
    const matDialog = this.openSqlDialog({ tables: this.data.source, table, action: 'Edit' });

    matDialog.afterClosed().subscribe(res => {
      if (res) {
        this.storeService.updateTable(Area.Source, table, res);
      }
    }
    );
  }

  openDeleteViewDialog(tableName) {
    const dialogRef = this.commonUtilsService.deleteTableWithWarning();
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const table = this.findSourceTableByName(tableName);
        this.storeService.removeTable(Area.Source, table);
        Object.keys(this.targetConfig).forEach(source => {
          if (this.targetConfig[ source ].data.includes(tableName)) {
            this.removeTableMapping(tableName, source);
          }
        });
      }
    });

  }

  isEditable(tableName: string): boolean {
    const table = this.findSourceTableByName(tableName);
    return table && table.sql;
  }

  findSourceTableByName(name) {
    return this.commonUtilsService.findTableByKeyValue(this.data.source, 'name', name);
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

  scanData() {
    this.matDialog.open(ScanDataDialogComponent, {
      width: '700',
      height: '674',
      disableClose: true,
      panelClass: 'scan-data-dialog'
    });
  }
}

export function bound(target: object, propKey: string | symbol) {
  const originalMethod = (target as any)[ propKey ] as Function;

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
        return instance[ propKey ];
      }
    } as PropertyDescriptor;
  }
}
