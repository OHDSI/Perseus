import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { takeUntil } from 'rxjs/operators';
import { uniq } from 'src/app/infrastructure/utility';
import { MappingPageSessionStorage } from 'src/app/models/implementation/mapping-page-session-storage';
import { ITable, Table } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';
import { BridgeService } from 'src/app/services/bridge.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

import { StateService } from 'src/app/services/state.service';
import { StoreService } from 'src/app/services/store.service';
import { BaseComponent } from '../../../common/components/base/base.component';
import { PanelComponent } from '../../panel/panel.component';
import { PreviewPopupComponent } from '../../popups/preview-popup/preview-popup.component';
import { RulesPopupService } from '../../popups/rules-popup/services/rules-popup.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { SetConnectionTypePopupComponent} from '../../popups/set-connection-type-popup/set-connection-type-popup.component';
import { DeleteLinksWarningComponent} from '../../popups/delete-links-warning/delete-links-warning.component';
import { CdmFilterComponent } from '../../popups/open-cdm-filter/cdm-filter.component';
import { Area } from 'src/app/models/area';
import { modes } from 'codemirror';
import * as groups from './groups-conf.json';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  source: ITable[];
  target: ITable[];

  sourceTabIndex = 0;
  targetTabIndex = 0;

  clickArrowSubscriptions = [];
  panelsViewInitialized = new Set();

  sourceRows: IRow[] = [];
  targetRows: IRow[] = [];

  mappedTables = [];

  similarTableName = 'similar';

  filteredFields;

  get hint(): string {
    return 'no hint';
  }

  get state() {
    return this.stateService.state;
  }

  @ViewChild('arrowsarea', { read: ElementRef, static: true }) svgCanvas: ElementRef;
  @ViewChild('maincanvas', { read: ElementRef, static: true }) mainCanvas: ElementRef;
  @ViewChild('sourcePanel') sourcePanel: PanelComponent;
  @ViewChild('targetPanel') targetPanel: PanelComponent;



  constructor(
    private stateService: StateService,
    private storeService: StoreService,
    private dataService: DataService,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private matDialog: MatDialog,
    private rulesPoupService: RulesPopupService,
    mappingElementRef: ElementRef,
    private mappingStorage: MappingPageSessionStorage,
    private overlayService: OverlayService
  ) {
    super();
    this.commonService.mappingElement = mappingElementRef;
  }

  ngAfterViewInit() {
    this.svgCanvas.nativeElement.addEventListener('mouseup', (event: any) => {
      const markerWidth = 16;
      const { offsetX, offsetY, currentTarget } = event;

      if (offsetX < markerWidth) {
        event.stopPropagation();
        this.startMarkerClick(offsetY, currentTarget);
      } else if (offsetX > currentTarget.clientWidth - markerWidth) {
        event.stopPropagation();
        this.endMarkerClick(offsetY, currentTarget);
      }
    });
  }

  startMarkerClick(offset: number, currentTarget: any) {
    let i = currentTarget.children.length - 1;
    while (i >= 0) {
      const child = currentTarget.children[i];
      i--;
      if (child.localName !== 'path') {
        continue;
      }

      const startXYAttributeIndex = 6;
      const { upperLimit, lowerLimit } = this.getLimits(child.attributes[startXYAttributeIndex].value);
      if (offset >= upperLimit && offset <= lowerLimit) {
        this.bridgeService.deleteArrow(child.id);
      }
    }
  }

  endMarkerClick(offset: number, currentTarget: any) {
    for (const child of currentTarget.children) {
      if (child.localName !== 'path') {
        continue;
      }

      const endXYAttributeIndex = 7;
      const { upperLimit, lowerLimit } = this.getLimits(child.attributes[endXYAttributeIndex].value);
      if (offset >= upperLimit && offset <= lowerLimit) {
        if (!this.bridgeService.arrowsCache[child.id].connector.selected) {
          return;
        }

        const dialogOptions: OverlayConfigOptions = {
          hasBackdrop: true,
          backdropClass: 'custom-backdrop',
          positionStrategyFor: 'values'
        };

        const component = SetConnectionTypePopupComponent;
        const rowIndex = child.id.split('/')[ 1 ].split('-')[ 1 ];
        const htmlElementId = this.targetPanel.table.rows[rowIndex].name;
        const htmlElement = document.getElementById(htmlElementId);

        const dialogRef = this.overlayService.open(dialogOptions, htmlElement, component);
        dialogRef.afterClosed$.subscribe((configOptions: any) => {
          const { connectionType } = configOptions;
          if (connectionType) {
            this.bridgeService.setArrowType(child.id, connectionType);
          }
        });
        return;
      }
    }
  }

  getLimits(value: string) {
    const offset = 8;
    const point = parseInt(value.split(',')[ 1 ], 0);
    const upperLimit = point - offset;
    const lowerLimit = point + offset;
    return { upperLimit, lowerLimit };
  }

  checkIncludesRows(rows, row) {
    return !!rows.find(r => r.name === row.name);
  }

  collectSimilarRows(rows, area, similarRows) {
    const rowsKey = `${area}Rows`;
    rows.forEach(row => {
      if (!this.checkIncludesRows(this[ rowsKey ], row)) {
        this[rowsKey].push(row);
        return;
      }

      if (!this.checkIncludesRows(similarRows, row)) {
        const rowForSimilar = { ...row, tableName: this.similarTableName, tableId: this.storeService.state[ area ].length };
        similarRows.push(rowForSimilar);
      }
    });
  }

  prepareTables(data, area) {
    const similarRows = [];

    const tables = data.map(table => {
      this.collectSimilarRows(table.rows, area, similarRows);
      return new Table(table);
    });

    if (similarRows.length) {
      const similarSourceTable = new Table({
        id: this.storeService.state[ area ].length,
        area,
        name: this.similarTableName,
        rows: similarRows
      });
      tables.push(similarSourceTable);
    }

    this[area] = tables;
  }

  prepareMappedTables(mappedTables) {
    this.mappedTables = mappedTables;

    this.addSimilar(Area.Source);
    this.addSimilar(Area.Target);
  }

  addSimilar(area) {
    const lastIndex = this[ area ].length - 1;
    const lastTableName = this[ area ][ lastIndex ].name;
    if (lastTableName === this.similarTableName) {
      this[ `${area}Similar` ](this[ area ][ lastIndex ].rows);
    }
  }

  sourceSimilar(rows) {
    rows.forEach(row => {
      this.sourceRows.forEach(sourceRow => {
        if (sourceRow.name !== row.name) {
          return;
        }

        this.mappedTables.forEach(item => {
          if (item.includes(sourceRow.tableName) && !item.includes(this.similarTableName)) {
            item.push(this.similarTableName);
          }
        });
      });
    });
  }

  targetSimilar(rows) {
    const newItem = [];
    rows.forEach(row => {
      this.targetRows.forEach(targetRow => {
        if (targetRow.name !== row.name) {
          return;
        }

        this.mappedTables.forEach(item => {
          if (!item.includes(targetRow.tableName)) {
            return;
          }

          if (!newItem.length) {
            newItem.push(this.similarTableName);
          }

          newItem.push.apply(newItem, item.slice(1));
        });
      });
    });
    this.mappedTables.push(uniq(newItem));
  }

  moveSimilarTables() {
    this.moveSimilar(Area.Source);
    this.moveSimilar(Area.Target);
  }

  moveSimilar(area) {
    if (this[ area ][ this[ area ].length - 1 ].name === this.similarTableName) {
      this[ area ].unshift(this[ area ].pop());
    }
  }

  ngOnInit() {
    this.mappingStorage.get('mappingpage').then(data => {
      this.prepareTables(data.source, Area.Source);
      this.prepareTables(data.target, Area.Target);
      this.prepareMappedTables(data.mappedTables);

      this.moveSimilarTables();

      setTimeout(() => {
        this.bridgeService.refresh(this.target[this.targetTabIndex]);
        this.sourcePanel.panel.reflectConnectorsPin(this.target[this.targetTabIndex]);
        this.targetPanel.panel.reflectConnectorsPin(this.source[this.sourceTabIndex]);
        this.bridgeService.adjustArrowsPositions();
      }, 200);
    });

    this.rulesPoupService.deleteConnector$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connectorKey => {
        this.bridgeService.deleteArrow(connectorKey);
      });

    this.storeService.state$.subscribe(res => {
      if (res) {
        this.filteredFields = res.filteredFields;
      }
    });
  }

  ngOnDestroy() {
    this.clickArrowSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    super.ngOnDestroy();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.bridgeService.deleteSelectedArrows();
    }
  }

  trackByFn(index, item) {
    return index;
  }

  previewMapping() {
    const mapping = this.bridgeService.generateMapping(this.source[this.sourceTabIndex].name);

    if (!mapping || !mapping.mapping_items || !mapping.mapping_items.length) {
      return;
    }

    this.dataService
      .getXmlPreview(mapping)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(json => {
        this.matDialog.open(PreviewPopupComponent, {
          data: json,
          maxHeight: '80vh',
          minWidth: '80vh'
        });
      });
  }

  generateMappingJson() {
    const mappingJSON = this.bridgeService.generateMapping();
    this.dataService
      .getZippedXml(mappingJSON)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(file => {
        saveAs(file);
      });
  }

  openFilter(target) {
    const optionalSaveKey = this.target[this.targetTabIndex].name;

    const filteredFields = this.filteredFields ? this.filteredFields[optionalSaveKey] : this.filteredFields;
    const types = filteredFields ? filteredFields.types : [];
    const checkedTypes = filteredFields ? filteredFields.checkedTypes : [];

    const options = (groups as any).default;
    options['individual'] = this.target[this.targetTabIndex].rows.map(row => {
      if (!options.common.includes(row.name) && !options.concept.includes(row.name)) {
        return row.name;
      }
    });
    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'filter-popup',
      payload: {
        title: 'Target fields',
        saveKey: 'filteredFields',
        types,
        checkedTypes,
        options,
        optionalSaveKey
      }
    };
    this.overlayService.open(dialogOptions, target, CdmFilterComponent);
  }

  getFilteredFields() {
    return this.filteredFields ? this.filteredFields[this.target[this.targetTabIndex].name] : [];
  }

  onPanelOpen() {
    if (this.panelsViewInitialized.size === this.source.length + this.target.length) {
      this.bridgeService.refresh(this.target[ this.targetTabIndex ], 200);
    }
  }

  onPanelClose() {
    if (this.panelsViewInitialized.size === this.source.length + this.target.length) {
      this.bridgeService.refresh(this.target[ this.targetTabIndex ], 200);
    }
  }

  onPanelInit(table: ITable) {
    if (!this.panelsViewInitialized.has(table)) {
      this.panelsViewInitialized.add(table);
    }

    if (this.panelsViewInitialized.size === this.source.length + this.target.length) {
      this.commonService.setSvg(this.svgCanvas);
      this.commonService.setMain(this.mainCanvas);
    }
  }

  onTabIndexChanged(index: number, tables: ITable[], area: string): void {
    this.bridgeService.hideAllArrows();

    if (area === 'source') {
      this.sourceTabIndex = index;
      this.changeTargetTabIndex();
    } else {
      this.targetTabIndex = index;
    }

    const wait = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.bridgeService.refresh(tables[ index ]);
        resolve();
      }, 1000);
    });
  }

  changeTargetTabIndex() {
    const tableName = this.source[ this.sourceTabIndex ].name;

    if (tableName === this.similarTableName && this.target[ 0 ].name === this.similarTableName) {
      this.targetTabIndex = 0;
    } else {
      const tagretTableNameIndex = 0;
      const targetTableName = this.mappedTables.find(item => item.includes(tableName))[ tagretTableNameIndex ];
      this.targetTabIndex = this.target.findIndex(element => element.name === targetTableName);
    }
  }

  isDisabled(tableName: string): boolean {
    const activeTableName = this.source[this.sourceTabIndex].name;
    return !this.mappedTables.find(item => item.includes(tableName) && item.includes(activeTableName));
  }

  isSimilarTabs() {
    if (!this.source && !this.target) {
      return false;
    }

    return (
      this.source[this.sourceTabIndex].name === this.similarTableName ||
      this.target[this.targetTabIndex].name === this.similarTableName
    );
  }

  isTooltipDisabled() {
    return !(
      this.filteredFields &&
      this.filteredFields[this.target[this.targetTabIndex].name] &&
      this.filteredFields[this.target[this.targetTabIndex].name].types &&
      this.filteredFields[this.target[this.targetTabIndex].name].types.length
    );
  }

  isFooterButtonDisabled() {
    return Object.keys(this.bridgeService.arrowsCache).length === 0;
  }

  deleteLinks() {
    const dialog = this.matDialog.open(DeleteLinksWarningComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog'
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.bridgeService.deleteAllArrows();
      }
    });
  }
}
