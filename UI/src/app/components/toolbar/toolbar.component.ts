import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { BridgeService } from '../../services/bridge.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { StoreService } from '../../services/store.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-toolbar',
  styleUrls: [ './toolbar.component.scss' ],
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

    this.commonUtilsService.loadSourceReport$.subscribe(res => {
      if (res) {
        this.uploadService.onFileInputClick(this.fileInput);
      }
    });
  }

  resetAllMappings() {
    this.commonUtilsService.resetMappingsWithWarning();
  }

  openSaveMappingDialog() {
    this.commonUtilsService.saveMappingDialog(false);
  }

  openLoadMappingDialog() {
    this.commonUtilsService.loadMappingDialog();
  }

  onOpenSourceClick() {
    this.commonUtilsService.loadNewReportWithWarning();
  }

  onFileUpload(event: Event) {
    this.uploadService.onFileChange(event);
  }

  openSetCDMDialog() {
    this.commonUtilsService.openSetCDMDialog();
  }

  resetSourceAndTarget() {
    this.commonUtilsService.resetSourceAndTargetWithWarning();
  }

  startOnBoarding(target: EventTarget) {
    this.commonUtilsService.openOnBoardingTip(target, 'tour-toolbar');
  }
}
