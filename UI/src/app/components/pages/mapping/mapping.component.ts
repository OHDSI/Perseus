import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MappingPageSessionStorage } from 'src/app/models/implementation/mapping-page-session-storage';
import { ITable, Table } from 'src/app/models/table';
import { BridgeService } from 'src/app/services/bridge.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

import { StateService } from 'src/app/services/state.service';
import { BaseComponent } from '../../base/base.component';
import { PanelTableComponent } from '../../panel/panel-table/panel-table.component';
import { PreviewPopupComponent } from '../../popups/preview-popup/preview-popup.component';
import { RulesPopupService } from '../../popups/rules-popup/services/rules-popup.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() source: ITable[];
  @Input() target: ITable[];

  tabIndex = 0;

  get hint(): string {
    return 'no hint';
  }

  get state() {
    return this.stateService.state;
  }

  @ViewChild('arrowsarea', { read: ElementRef, static: true }) svgCanvas: ElementRef;
  @ViewChild('maincanvas', { read: ElementRef, static: true }) mainCanvas: ElementRef;
  @ViewChild('sourcePanel', { static: false }) sourcePanel: PanelTableComponent;

  clickArrowSubscriptions = [];
  panelsViewInitialized = new Set();

  constructor(
    private stateService: StateService,
    private dataService: DataService,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private matDialog: MatDialog,
    private rulesPoupService: RulesPopupService,
    mappingElementRef: ElementRef,
    private mappingStorage: MappingPageSessionStorage
  ) {
    super();
    this.commonService.mappingElement = mappingElementRef;
  }

  ngOnInit() {
    this.mappingStorage.get('mappingpage').then(data => {
      this.source = data.source.map(table => new Table(table));
      this.target = data.target.map(table => new Table(table));

      setTimeout(() => {
        this.bridgeService.refresh(this.target);
        this.sourcePanel.reflectConnectorsPin(this.target[this.tabIndex]);
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

  ngAfterViewInit() {

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
    const source_table = mapping['mapping_items'][0]['source_table'];
    this.dataService
      .getXmlPreview(mapping)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(_ => this.dataService.getSqlPreview(source_table))
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

  wipeAllMappings() {
    this.bridgeService.deleteAllArrows();
  }

  onPanelOpen(table) {
    if (
      this.panelsViewInitialized.size ===
      this.source.length + this.target.length
    ) {
      this.bridgeService.refresh(this.target, 200);
    }
  }

  onPanelClose(table) {
    if (
      this.panelsViewInitialized.size ===
      this.source.length + this.target.length
    ) {
      this.bridgeService.refresh(this.target, 200);
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

  onTabIndexChanged(index: number): void {
    this.tabIndex = index;

    this.bridgeService.hideAllArrows();
    this.sourcePanel.hideAllConnectorPin(document);

    const wait = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.target.forEach(panel => (panel.expanded = false));
        this.target[index].expanded = true;
        this.bridgeService.refresh([this.target[index]]);
        this.sourcePanel.reflectConnectorsPin(this.target[index]);
        resolve();
      }, 500);
    });
  }
}
