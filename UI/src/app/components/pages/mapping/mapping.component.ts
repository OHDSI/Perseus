import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener
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

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit, AfterViewInit {
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

  constructor(
    private stateService: StateService,
    private dataService: DataService,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private matDialog: MatDialog,
    private rulesPoupService: RulesPopupService
  ) {}

  ngOnInit() {
    this.rulesPoupService.deleteConnector$.subscribe(done => {
      console.log(done);
      this.bridgeService.deleteSelectedArrows();
    });
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

  trackByFn(index) {
    return index;
  }

  previewMapping() {
    const mapping = this.bridgeService.generateMapping();

    this.dataService.getXml(mapping).subscribe(json => {
      const previewDialog = this.matDialog.open(PreviewPopupComponent, {
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
    this.bridgeService.refresh(this.target[0].name);
  }

  onSourcePanelClose() {
    this.bridgeService.refresh(this.target[0].name);
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
        this.bridgeService.deleteTableArrows(table);
      }
    });
  }
}
