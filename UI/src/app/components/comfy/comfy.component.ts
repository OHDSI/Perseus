import { CdkDrag, CdkDragDrop, CdkDragMove, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { merge, Subscription } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Command } from 'src/app/infrastructure/command';
import { uniq, uniqBy } from 'src/app/infrastructure/utility';
import { MappingPageSessionStorage } from 'src/app/models/implementation/mapping-page-session-storage';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';
import { DataService } from 'src/app/services/data.service';
import { StateService } from 'src/app/services/state.service';
import { IVocabulary, VocabulariesService } from 'src/app/services/vocabularies.service';
import { environment } from 'src/environments/environment';
import { CommonUtilsService } from '../../services/common-utils.service';
import { OverlayConfigOptions } from '../../services/overlay/overlay-config-options.interface';
import { OverlayService } from '../../services/overlay/overlay.service';
import { StoreService } from '../../services/store.service';
import { UploadService } from '../../services/upload.service';
import { BaseComponent } from '../base/base.component';
import { Criteria } from '../comfy-search-by-name/comfy-search-by-name.component';
import { isConceptTable } from './services/concept.service';
import { CdmFilterComponent } from '../popups/open-cdm-filter/cdm-filter.component';

@Component({
  selector: 'app-comfy',
  templateUrl: './comfy.component.html',
  styleUrls: ['./comfy.component.scss']
})
export class ComfyComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  get state() {
    return this.stateService.state;
  }

  targetTableNames: string[] = [];

  get highlitedTables(): string[] {
    return this.highlitedtables;
  }

  COLUMNS_TO_EXCLUDE_FROM_TARGET = ['CONCEPT', 'COMMON'];

  busy = true;
  private highlitedtables: string[] = [];

  source: string[] = [];

  target = {};
  sourceConnectedTo = [];
  sourceRows: IRow[] = [];

  private snakbarOptions = {
    duration: 3000
  };

  speed = 5;
  subs = new Subscription();
  private animationFrame: number | undefined;

  vocabularies: IVocabulary[] = [];
  data = {
    source: [],
    target: [],
    version: undefined,
    filtered: undefined,
  };

  constructor(
    private dataService: DataService,
    private vocabulariesService: VocabulariesService,
    private stateService: StateService,
    private storeService: StoreService,
    private commonUtilsService: CommonUtilsService,
    private bridgeService: BridgeService,
    private snakbar: MatSnackBar,
    private router: Router,
    private mappingStorage: MappingPageSessionStorage,
    private uploadService: UploadService,
    private overlayService: OverlayService,
  ) {
    super();
  }

  @ViewChild('scrollEl', { static: false })
  scrollEl: ElementRef<HTMLElement>;
  @ViewChild('sourceUpload', { static: false })
  fileInput: ElementRef<HTMLElement>;
  @ViewChild(CdmFilterComponent, {static: false})
  cdmFilter: CdmFilterComponent;

  @ViewChildren(CdkDrag)
  dragEls: QueryList<CdkDrag>;

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
    const baseEl = this.scrollEl.nativeElement;
    const box = baseEl.getBoundingClientRect();
    const scrollTop = baseEl.scrollTop;
    const top = box.top + -y;
    if (top > 0 && scrollTop !== 0) {
      const newScroll = scrollTop - this.speed * Math.exp(top / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
      return;
    }

    const bottom = y - box.bottom;
    if (bottom > 0 && scrollTop < box.bottom) {
      const newScroll = scrollTop + this.speed * Math.exp(bottom / 50);
      baseEl.scrollTop = newScroll;
      this.animationFrame = requestAnimationFrame(() => this.scroll($event));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    /*Experiment for vocabulary*/
    this.vocabulariesService
      .setVocabularyConnectionString()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        ok => {
          this.vocabulariesService
            .getVocabularies()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(vocabularies => {
              this.vocabularies = [...vocabularies];
            });
        },
        error => console.error(error)
      );
    /*Experiment for vocabulary*/

    // this.dataService
    //   .initialize()
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     switchMap(_ => {
    //      // this.stateService.switchSourceToTarget(); // ??
    //       this.initializeSourceData();
    //       this.initializeTargetData();
    //       this.initializeSourceColumns();
    //       this.busy = false;
    //       return this.mappingStorage.get('mappingtables');
    //     })
    //   )
    //   .subscribe(target => {
    //    // this.target = target;
    //   });
    this.storeService.state$.subscribe(res => {
      this.data = res;
      this.initializeData();
    });

    this.bridgeService.applyConfiguration$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(configuration => {
        this.target = configuration.tables;
      });

    this.bridgeService.resetAllMappings$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        this.initializeData();

        this.snakbar.open(
          'Reset all mappings success',
          ' DISMISS ',
          this.snakbarOptions
        );
      });

    this.bridgeService.saveAndLoadSchema$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        this.initializeData();

        this.snakbar.open(
          'New source schema loaded',
          ' DISMISS ',
          this.snakbarOptions
        );
      });

  }

  initializeSourceData() {
    this.source = [];
    this.source = uniq(
      this.data.source
        .map(table => table.name)
    );
  }

  initializeTargetData() {
    this.target = {};

    const prefix = 'target';

    this.data.target.map(table => {
      if (this.COLUMNS_TO_EXCLUDE_FROM_TARGET.findIndex(name => name === table.name) < 0) {
        const tableName = table.name;
        this.target[tableName] = {
          name: `${prefix}-${tableName}`,
          first: tableName,
          data: [tableName]
        };
      }
    });

    this.targetTableNames = uniq(Object.keys(this.target));

    this.sourceConnectedTo = this.data.target.map(
      table => `${prefix}-${table.name}`
    );

    this.stateService.Target = this.target;
    if (this.data.filtered) {
      this.filterByType();
    }
  }

  initializeSourceColumns() {
    if (!this.data.source.length) {
      return;
    }
    const allColumns = this.data.source.map(table => table.rows).reduce((acc, val) => [...acc, ...val]);
    this.sourceRows = uniqBy(allColumns, 'name');
  }

  initializeData() {
    this.initializeSourceData();
    this.initializeTargetData();
    this.initializeSourceColumns();
  }

  // tslint:disable-next-line:member-ordering
  drop = new Command({
    execute: (event: CdkDragDrop<string[]>) => {
      const {container , previousContainer, previousIndex} = event;
      const data = container.data;

      if (previousContainer === container) {
        moveItemInArray(data, previousIndex, event.currentIndex);
      } else {
        copyArrayItem(previousContainer.data, data, previousIndex, data.length);
        const targetname = container.id.split('-')[1];
        this.setFirstElementAlwaysOnTop(targetname, event);
        this.stateService.Target = this.target;
      }
    },
    canExecute: (event: CdkDragDrop<string[]>) => {
      return event.container.data.findIndex(tableName => event.previousContainer.data[event.previousIndex] === tableName) === -1;
    }
  });

  setFirstElementAlwaysOnTop(
    targetname: string,
    event: CdkDragDrop<string[]>
  ): void {
    if (!targetname) {
      return;
    }

    const { data, first } = this.target[targetname];
    const index = data.findIndex(value => value === first);
    if (index) {
      const temp = data[0];
      data[0] = first;
      data[index] = temp;
    }
  }

  async openMapping(targetTableName: string) {
    let sourceTablesNames = [];
    const targetTablesNames = Object.keys(this.target).filter(key => {
      const data = this.target[key].data;
      if (data.length > 1) {
        sourceTablesNames.push(...data.slice(1, data.length));
        return true;
      }
      return false;
    });
    sourceTablesNames = uniq(sourceTablesNames);

    const targetTables = this.data.target.filter(table => targetTablesNames.includes(table.name));
    const sourceTables = this.data.source.filter(table => sourceTablesNames.includes(table.name));

    const payload = {
      source: sourceTables,
      target: targetTables,
      allTarget: this.data.target
    };

    this.mappingStorage.remove('mappingtables');
    await this.mappingStorage.add('mappingtables', this.target);

    this.mappingStorage.remove('mappingpage');
    await this.mappingStorage.add('mappingpage', payload);

    this.router.navigateByUrl('/mapping');
  }

  findTables(selectedSourceColumns: string[]): void {
    const indexes = {};

    this.data.source.forEach(table => {
      indexes[table.name] = selectedSourceColumns.map(columnname =>
        table.rows.findIndex(r => r.name === columnname)
      );
    });

    this.highlitedtables = Object.keys(indexes).filter(tableName => {
      return (
        indexes[tableName].length > 0 &&
        (indexes[tableName].findIndex(idx => idx > -1) > -1)
      );
    });

    this.source = Object.assign([], this.source);
  }

  removeTableMapping(
    event: any,
    sourceTableName: string,
    targetTableName: string
  ) {
    event.stopPropagation();

    const table = this.target[targetTableName];
    const { data } = table;

    const index = data.findIndex(tablename => tablename === sourceTableName);

    if (index > -1) {
      data.splice(index, 1);
    }

    if (isConceptTable(targetTableName)) {
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
    }
  }

  filterByName(area: string, byName: Criteria): void {
    const areas = ['source-column', 'target', 'source'];
    const idx = areas.indexOf(area);

    const filterByName = (name, index?) => {
      return name.toUpperCase().indexOf(byName.criteria.toUpperCase()) > -1;
    };

    if (idx > -1) {
      switch (area) {
        case 'source': {
          this.source = this.source.filter(filterByName);
          break;
        }
        case 'target': {
          this.targetTableNames = uniq(Object.keys(this.target)).filter(filterByName);
          break;
        }
        case 'source-column': {
          this.sourceRows = this.sourceRows.filter(row => filterByName(row.name));
          break;
        }
      }
    }
  }

  filterByType(): void {
    const uniqueTargetNames = uniq(Object.keys(this.target));
    const {tables: selectedTables} = this.data.filtered;
    if (selectedTables.length === 0) {
      this.targetTableNames = uniqueTargetNames;
      return;
    }
    const filterByType = (name) => !!selectedTables.find(x => x === name.toUpperCase());
    this.targetTableNames = uniqueTargetNames.filter(filterByType);
  }

  filterByNameReset(area: string, byName: Criteria): void {
    const areas = ['source-column', 'target', 'source'];
    const idx = areas.indexOf(area);

    if (idx > -1) {
      switch (area) {
        case 'source': {
          this.initializeSourceData();
          break;
        }
        case 'target': {
          this.initializeTargetData();
          break;
        }
        case 'source-column': {
          this.initializeSourceColumns();
          break;
        }
      }
    }
  }

  loadNewReport() {
    this.uploadService.onFileInputClick(this.fileInput);
  }

  openSetCDMDialog() {
    this.commonUtilsService.openSetCDMDialog();
  }

  onFileUpload(event: Event) {
    this.uploadService.onFileChange(event);
  }

  openFilter(target) {
    const types = this.data.filtered ? this.data.filtered.types : [];
    const checkedTypes = this.data.filtered ? this.data.filtered.checkedTypes : [];
    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'filter-popup',
      payload: { types, checkedTypes }
    };
    this.overlayService.open(dialogOptions, target, CdmFilterComponent);
  }

  resetMapping() {
    this.commonUtilsService.openResetWarningDialog(false);
  }

  checkExistingMappings(): boolean {
    return !!this.targetTableNames.find(it => this.target[it].data.length > 1)
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
