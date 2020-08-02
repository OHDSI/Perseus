import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { OpenMappingDialog } from '../../app.component';
import { BridgeService } from '../../services/bridge.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { StoreService } from '../../services/store.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
  @ViewChild('sourceUpload', { static: true }) fileInput: ElementRef;

  cdmVersion: string;
  reportName: string;

  constructor(
    private bridgeService: BridgeService,
    private commonUtilsService: CommonUtilsService,
    private uploadService: UploadService,
    private storeService: StoreService
  ) {

  }

  ngOnInit() {
    this.storeService.state$.subscribe((res: any) => {
      this.cdmVersion = res.version ? `CDM v${res.version}` : 'CDM version';
      this.reportName = res.report || 'Report name';
    });
  }

  resetAllMappings() {
    this.bridgeService.resetAllMappings();
  }

  openSaveMappingDialog(action: OpenMappingDialog) {
    this.commonUtilsService.openSaveMappingDialog(action, false);
  }

  onOpenSourceClick() {
    this.uploadService.onFileInputClick(this.fileInput);
  }

  onFileUpload(event: Event) {
    this.uploadService.onFileChange(event);
  }

  openSetCDMDialog() {
    this.commonUtilsService.openSetCDMDialog();
  }

  resetSourceAndTarget() {
    const settings = {
      warning: 'All mappings will be lost. Do you want to save created mappings?',
      header: 'Save mappings',
      okButton: 'Save',
      deleteButton: 'Delete',
      deleteAll: true
    };
    this.commonUtilsService.openResetWarningDialog(settings);
  }

  startOnBoarding(target: EventTarget) {
    this.commonUtilsService.openOnBoardingTip(target,  'tour-toolbar');
  }
}
