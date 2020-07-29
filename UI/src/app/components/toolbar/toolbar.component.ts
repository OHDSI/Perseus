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

  ngOnInit(){
    this.storeService.state$.subscribe(res => {
      this.cdmVersion = res['version'] ? `CDM v${res['version']}` : 'CDM version';
      this.reportName = res['report'] ? res['report'] : 'Report name';
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
    this.commonUtilsService.openResetWarningDialog('All mappings will be lost. Do you want to save created mappings?',
    'Save mappings',
    'Save',
    'Delete',
    true);
  }
}
