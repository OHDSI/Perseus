import { Component, ElementRef, ViewChild } from '@angular/core';

import { OpenMappingDialog } from '../../app.component';
import { BridgeService } from '../../services/bridge.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {
  @ViewChild('sourceUpload', {static: true}) fileInput: ElementRef;

  constructor(
    private bridgeService: BridgeService,
    private commonUtilsService: CommonUtilsService,
    private uploadService: UploadService
  ) {

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
