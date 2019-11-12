import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy
} from '@angular/core';

import { StateService } from 'src/app/services/state.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { BridgeService } from 'src/app/services/bridge.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material';
import { PreviewPopupComponent } from '../../popaps/preview-popup/preview-popup.component';
import { ITable } from 'src/app/models/table';
import { RulesPopupService } from '../../popaps/rules-popup/services/rules-popup.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { IConnector } from 'src/app/models/interface/connector.interface';
import { BaseComponent } from '../../base/base.component';
import { ConceptService } from '../../comfy/services/concept.service';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { TransformRulesData } from '../../popaps/rules-popup/model/transform-rules-data';
import { RulesPopupComponent } from '../../popaps/rules-popup/rules-popup.component';
import { TransformConfigComponent } from '../../vocabulary-transform-configurator/transform-config.component';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() source: ITable[];
  @Input() target: ITable[];

  get hint(): string {
    return 'no hint';
    // return this.commonService.hintStatus;
  }

  get state() {
    return this.stateService.state;
  }

  @ViewChild('arrowsarea', { read: ElementRef }) svgCanvas: ElementRef;
  @ViewChild('maincanvas', { read: ElementRef }) mainCanvas: ElementRef;

  clickArrowSubscriptions = [];

  constructor(
    private stateService: StateService,
    private dataService: DataService,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private matDialog: MatDialog,
    private rulesPoupService: RulesPopupService,
    private conceptService: ConceptService,
    private overlayService: OverlayService,
    private mappingElementRef: ElementRef
  ) {
    super();
    this.commonService.mappingElement = mappingElementRef;
  }

  ngOnInit() {
    this.bridgeService.connection
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connection => {
        this.clickArrowSubscriptions.push(
          connection.connector.clicked.subscribe(x => this.clickArrowHandler(x))
        );
      });

    this.rulesPoupService.deleteConnector$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(done => {
        console.log(done);
        this.bridgeService.deleteSelectedArrows();
      });

    this.switchSourceToTarget();
  }

  clickArrowHandler(arrow: IConnector) {
    let payloadObj: TransformRulesData;

    const insnantiationType = {
      transform: RulesPopupComponent,
      lookup: TransformConfigComponent
    };

    const isConcept = this.conceptService.isConceptTable(
      arrow.target.tableName
    );

    payloadObj = {
      connector: arrow,
      arrowCache: this.bridgeService.arrowsCache
    };

    const dialogOptions = {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'transformation-unit',
      positionStrategyFor: 'simple-transform',
      payload: payloadObj
    };

    let component: any = insnantiationType.transform;

    let ancor = this.mappingElementRef.nativeElement;

    if (isConcept) {
      component = insnantiationType.lookup;
      dialogOptions.positionStrategyFor = 'advanced-transform';
      ancor = this.commonService.mappingElement.nativeElement;
    }

    // Open

    payloadObj.connector.select();

    const dialogRef = this.overlayService.open(dialogOptions, ancor, component);

    dialogRef.close$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(configOptions => {
        payloadObj.connector.deselect();
      });
  }

  ngOnDestroy() {
    this.clickArrowSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    this.commonService.setSvg(this.svgCanvas);
    this.commonService.setMain(this.mainCanvas);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.bridgeService.deleteSelectedArrows();
    }
  }

  switchSourceToTarget() {
    const temp = [...this.source];
    this.source = [...this.target];
    this.target = temp;
  }

  trackByFn(index) {
    return index;
  }

  previewMapping() {
    const mapping = this.bridgeService.generateMapping();

    this.dataService
      .getXmlPreview(mapping)
      .pipe(switchMap(_ => this.dataService.getSqlPreview()))
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
    this.dataService.getZippedXml(mappingJSON).subscribe(file => {
      saveAs(file);
    });
  }

  wipeAllMappings() {
    this.bridgeService.deleteAllArrows();
  }

  onSourcePanelOpen() {
    this.bridgeService.refresh(this.target);
  }

  onSourcePanelClose() {
    this.bridgeService.refresh(this.target);
    this.source.forEach(table =>
      this.hideArrowsIfCorespondingTableasAreClosed(table)
    );
  }

  private hideArrowsIfCorespondingTableasAreClosed(table: ITable) {
    const corespondingTableNames = this.bridgeService.findCorrespondingTables(
      table
    );

    corespondingTableNames.forEach(name => {
      const correspondentTable = this.stateService.findTable(name);
      if (!correspondentTable.expanded && !table.expanded) {
        this.bridgeService.hideTableArrows(table);
      }
    });
  }
}
