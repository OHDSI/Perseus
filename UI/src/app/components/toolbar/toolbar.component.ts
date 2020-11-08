import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { BridgeService } from '../../services/bridge.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { stateToInfo, StoreService } from '../../services/store.service';
import { UploadService } from '../../services/upload.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const { prefix: prefix } = environment;

@Component({
  selector: 'app-toolbar',
  styleUrls: [ './toolbar.component.scss' ],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
  @ViewChild('sourceUpload', { static: true }) fileInput: ElementRef;
  @ViewChild('mappingUpload', { static: true }) mappingInput: ElementRef;

  cdmVersion: string;
  reportName: string;

  constructor(
    private bridgeService: BridgeService,
    private commonUtilsService: CommonUtilsService,
    private uploadService: UploadService,
    private storeService: StoreService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.storeService.state$.subscribe((res: any) => {
      const info = stateToInfo(res);
      this.cdmVersion = info.cdmVersion;
      this.reportName = info.reportName;
    });

    this.commonUtilsService.loadSourceReport$.subscribe(res => {
      if (res) {
        this.uploadService.onFileInputClick(this.fileInput);
      }
    });
  }

  goToComfy() {
    this.router.navigateByUrl(`/${prefix}comfy`);
  }

  IsCreateNewMappingDisabled() {
    return !(this.storeService.state.source.length && this.storeService.state.target.length);
  }

  resetAllMappings() {
    this.commonUtilsService.resetMappingsWithWarning();
  }

  openSaveMappingDialog() {
    this.commonUtilsService.saveMappingDialog(false, false);
  }

  openLoadMappingDialog() {
   this.uploadService.onFileInputClick(this.mappingInput);
  }

  onOpenSourceClick() {
    this.commonUtilsService.loadNewReportWithWarning();
  }

  onFileUpload(event: Event) {
    this.bridgeService.reportLoading();
    this.uploadService.onFileChange(event);
  }

  onMappingUpload(event: Event) {
    this.uploadService.onMappingChange(event);
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
