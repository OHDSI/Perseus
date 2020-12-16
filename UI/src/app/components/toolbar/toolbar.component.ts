import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BridgeService } from '../../services/bridge.service';
import { CommonUtilsService } from '../../services/common-utils.service';
import { stateToInfo, StoreService } from '../../services/store.service';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { map, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Area } from 'src/app/models/area';
import { ScanDataDialogComponent } from '../../scan-data/scan-data-dialog/scan-data-dialog.component';
import { FakeDataDialogComponent } from '../../scan-data/fake-data-dialog/fake-data-dialog.component';
import { Observable } from 'rxjs/internal/Observable';
import { CdmDialogComponent } from '../../scan-data/cdm-dialog/cdm-dialog.component';


@Component({
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('sourceUpload', {static: true}) fileInput: ElementRef;
  @ViewChild('mappingUpload', {static: true}) mappingInput: ElementRef;

  cdmVersion: string;
  reportName: string;

  fakeDataDisabled$: Observable<boolean>;

  convertToCdmDisabled$: Observable<boolean>;

  private scanDataMatDialogSharedParams = {
    disableClose: true,
    panelClass: 'scan-data-dialog'
  };

  constructor(
    private bridgeService: BridgeService,
    private commonUtilsService: CommonUtilsService,
    private uploadService: UploadService,
    private storeService: StoreService,
    private router: Router,
    private matDialog: MatDialog,
    private dataService: DataService
  ) {
    super();
  }

  ngOnInit() {
    this.storeService.state$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((res: any) => {
        const info = stateToInfo(res);
        this.cdmVersion = info.cdmVersion;
        this.reportName = info.reportName;
      });

    this.commonUtilsService.loadSourceReport$.subscribe(res => {
      if (res) {
        this.uploadService.onFileInputClick(this.fileInput);
      }
    });

    this.initStreamsOfDisabledButtons();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  goToComfy() {
    this.router.navigateByUrl(`/comfy`);
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

  generateAndSave() {
    const {source} = this.storeService.getMappedTables();

    const areaRows = [];

    const sourceTables = this.bridgeService.prepareTables(source, Area.Source, areaRows);

    const mappingJSON = this.bridgeService.getMappingWithViewsAndGroups(sourceTables);

    this.dataService
      .getZippedXml(mappingJSON)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(file => {
        saveAs(file);
      });
  }

  scanData() {
    this.matDialog.open(ScanDataDialogComponent, {
      width: '700',
      height: '674',
      ...this.scanDataMatDialogSharedParams
    });
  }

  generateFakeData() {
    this.matDialog.open(FakeDataDialogComponent, {
      width: '253',
      height: '270',
      ...this.scanDataMatDialogSharedParams
    });
  }

  convertToCdm() {
    this.matDialog.open(CdmDialogComponent, {
      width: '700',
      height: '674',
      ...this.scanDataMatDialogSharedParams
    });
  }

  private initStreamsOfDisabledButtons() {
    this.fakeDataDisabled$ = this.storeService.state$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(state => !(state.reportFile as boolean))
      );

    this.convertToCdmDisabled$ = this.storeService.state$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(state => !state.mappingCreated)
      );
  }
}
