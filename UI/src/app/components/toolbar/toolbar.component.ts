import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import { OpenMappingDialog } from '../../app.component';
import { BridgeService } from '../../services/bridge.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { UploadService } from '../../services/upload.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit{
  @ViewChild('sourceUpload', {static: true}) fileInput: ElementRef;

  cdmVersion: string;
  reportName: string;
  constructor(
    private bridgeService: BridgeService,
    private commonUtilsService: CommonUtilsService,
    private uploadService: UploadService,
    private storeService: StoreService
  ) {

  }

  ngOnInit(){
    this.storeService.state$.subscribe(res => {
      this.cdmVersion = res['version'];
      this.reportName = res['report'];
    });
  }

  resetAllMappings() {
    this.bridgeService.resetAllMappings();
  }

  openSaveMappingDialog(action: OpenMappingDialog) {
    this.commonUtilsService.openSaveMappingDialog(action);
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
}
