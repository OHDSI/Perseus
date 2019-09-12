import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { StateService } from 'src/app/services/state.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { BridgeService } from 'src/app/services/bridge.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material';
import { PreviewPopupComponent } from '../../popaps/preview-popup/preview-popup.component';
import { ITable } from 'src/app/models/table';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit, AfterViewInit {
  @Input() source: ITable[];
  @Input() target: ITable[];

  get hint() {
    return this.commonService.hintStatus;
  }

  get state() {
    return this.stateService.state;
  }

  @ViewChild('arrowsarea', {read: ElementRef}) svgCanvas: ElementRef;
  @ViewChild('maincanvas', {read: ElementRef}) mainCanvas: ElementRef;

  constructor(
    private stateService: StateService,
    private dataService: DataService,
    private commonService: CommonService,
    private bridgeService: BridgeService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.commonService.setSvg(this.svgCanvas);
    this.commonService.setMain(this.mainCanvas);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.bridgeService.removeSelectedArrows();
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
        width: '80vh',
        height: '80vh'
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
    this.bridgeService.removeAllArrows();
  }
}
