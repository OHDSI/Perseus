import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { OpenMappingDialog } from '../../app.component';
import { BridgeService } from '../../services/bridge.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { OverlayConfigOptions } from '../../services/overlay/overlay-config-options.interface';
import { OverlayService } from '../../services/overlay/overlay.service';
import { StoreService } from '../../services/store.service';
import { UploadService } from '../../services/upload.service';
import { OnBoardingComponent } from '../popups/on-boarding/on-boarding.component';

@Component({
  styleUrls: ['./toolbar.component.scss'],
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
  @ViewChild('sourceUpload', { static: true }) fileInput: ElementRef;

  cdmVersion: string;
  reportName: string;

  constructor(
    private overlayService: OverlayService,
    private bridgeService: BridgeService,
    private commonUtilsService: CommonUtilsService,
    private uploadService: UploadService,
    private storeService: StoreService,
    private renderer: Renderer2
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

  openOnBoarding(target: EventTarget) {
    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'on-boarding-backdrop',
      panelClass: 'on-boarding-bottom',
      payload: { tips: [] },
      positionStrategyFor: 'tour-toolbar'
    };
    const dialogRef = this.overlayService.open(dialogOptions, target, OnBoardingComponent);
    this.renderer.addClass(target, 'on-boarding-anchor');
    dialogRef.afterClosed$.subscribe(configOptions => this.renderer.removeClass(target, 'on-boarding-anchor'));
  }

  startOnBoarding(target: EventTarget) {
    this.openOnBoarding(target);
  }
}
