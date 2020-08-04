import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MappingPageSessionStorage } from 'src/app/models/implementation/mapping-page-session-storage';
import { ITable, Table } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

import { StateService } from 'src/app/services/state.service';
import { StoreService } from 'src/app/services/store.service';
import { BaseComponent } from '../../base/base.component';
import { PanelSourceComponent } from '../../panel/panel-source.component';
import { PanelTargetComponent } from '../../panel/panel-target.component';
import { PreviewPopupComponent } from '../../popups/preview-popup/preview-popup.component';
import { RulesPopupService } from '../../popups/rules-popup/services/rules-popup.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { SetConnectionTypePopupComponent} from '../../popups/set-connection-type-popup/set-connection-type-popup.component';
import { DeleteLinksWarningComponent} from '../../popups/delete-links-warning/delete-links-warning.component';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() source: ITable[];
  @Input() target: ITable[];

  sourceTabIndex = 0;
  targetTabIndex = 0;
  mappedTables = [];

  get hint(): string {
    return 'no hint';
  }

  get state() {
    return this.stateService.state;
  }

  @ViewChild('arrowsarea', { read: ElementRef, static: true }) svgCanvas: ElementRef;
  @ViewChild('maincanvas', { read: ElementRef, static: true }) mainCanvas: ElementRef;
  @ViewChild('sourcePanel') sourcePanel: PanelSourceComponent;
  @ViewChild('targetPanel') targetPanel: PanelTargetComponent;

  clickArrowSubscriptions = [];
  panelsViewInitialized = new Set();

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
    this.commonService.alignBreadcrumb({left: '3%'});
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
        const rowIndex = child.id.split('/')[1].split('-')[1];
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
    const point = parseInt(value.split(',')[1], 0);
    const upperLimit = point - offset;
    const lowerLimit = point + offset;
    return { upperLimit, lowerLimit };
  }

  ngOnInit() {
    this.mappingStorage.get('mappingpage').then(data => {
      this.source = data.source.map(table => {
        table.expanded = true;
        return new Table(table);
      });
      this.target = data.target.map(table => {
        table.expanded = true;
        return new Table(table);
      });

      this.mappedTables = data.mappedTables;

      setTimeout(() => {
        this.bridgeService.refresh(this.target[this.targetTabIndex]);
        this.sourcePanel.panel.reflectConnectorsPin(this.target[this.targetTabIndex]);
        this.targetPanel.panels.forEach(panel => panel.reflectConnectorsPin(this.source[this.sourceTabIndex]));
        this.bridgeService.adjustArrowsPositions();
      }, 200);
    });

    this.rulesPoupService.deleteConnector$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connectorKey => {
        this.bridgeService.deleteArrow(connectorKey);
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
    const mapping = this.bridgeService.generateMapping();
    if (!mapping || !mapping.mapping_items || !mapping.mapping_items.length) {
      return;
    }
    const sourceTable = mapping.mapping_items[0].source_table;
    this.dataService
      .getXmlPreview(mapping)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(_ => this.dataService.getSqlPreview(sourceTable))
      )
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

  onPanelOpen(table) {
    if (
      this.panelsViewInitialized.size ===
      this.source.length + this.target.length
    ) {
      this.bridgeService.refresh(this.target[this.targetTabIndex], 200);
    }
  }

  onPanelClose(table) {
    if (
      this.panelsViewInitialized.size ===
      this.source.length + this.target.length
    ) {
      this.bridgeService.refresh(this.target[this.targetTabIndex], 200);
    }
  }

  onPanelInit(table: ITable) {
    if (!this.panelsViewInitialized.has(table)) {
      this.panelsViewInitialized.add(table);
    }

    if (
      this.panelsViewInitialized.size ===
      this.source.length + this.target.length
    ) {
      this.commonService.setSvg(this.svgCanvas);
      this.commonService.setMain(this.mainCanvas);
      this.source.forEach(panel => (panel.expanded = true));
      this.target.forEach(panel => (panel.expanded = true));
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
        tables.forEach(table => (table.expanded = false));
        tables[index].expanded = true;
        this.bridgeService.refresh(tables[index]);
        resolve();
      }, 500);
    });
  }

  changeTargetTabIndex() {
    const tableName = this.source[this.sourceTabIndex].name;
    const tagretTableNameIndex = 0;
    const targetTableName = this.mappedTables.find(item => item.includes(tableName))[tagretTableNameIndex];
    this.targetTabIndex = this.target.findIndex(element => element.name === targetTableName);
  }

  isDisabled(tableName: string): boolean {
    const activeTableName = this.source[this.sourceTabIndex].name;
    return !this.mappedTables.find(item => item.includes(tableName) && item.includes(activeTableName));
  }

  isDeleteLinksDisabled() {
    const a = Object.keys(this.bridgeService.arrowsCache).length;
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
