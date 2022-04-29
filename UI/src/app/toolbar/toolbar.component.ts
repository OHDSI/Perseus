import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BridgeService } from '@services/bridge.service';
import { CommonUtilsService } from '@services/common-utils.service';
import { stateToInfo, StoreService } from '@services/store.service';
import { UploadService } from '@services/upload.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { map, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Area } from 'src/app/models/area';
import { ScanDataDialogComponent } from '@scan-data/scan-data-dialog/scan-data-dialog.component';
import { FakeDataDialogComponent } from '@scan-data/fake-data-dialog/fake-data-dialog.component';
import { Observable } from 'rxjs';
import { CdmDialogComponent } from '@scan-data/cdm-dialog/cdm-dialog.component';
import { DqdDialogComponent } from '@scan-data/dqd-dialog/dqd-dialog.component';
import { BaseComponent } from '@shared/base/base.component';
import { VocabularyObserverService } from '@services/athena/vocabulary-observer.service';
import { ReportGenerationEvent, ReportGenerationService, ReportType } from '@services/report/report-generation.service';
import { codesRouter, mainPageRouter } from '../app.constants';
import { LogoutComponent } from '@popups/logout/logout.component';
import { ErrorPopupComponent } from '@popups/error-popup/error-popup.component';
import { HelpPopupComponent } from '@popups/help-popup/help-popup.component';
import { AuthFacadeService } from '@services/state/auth-facade.service';
import { parseHttpError } from '@utils/error'

@Component({
  selector: 'app-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('sourceUpload', {static: true}) reportInput: ElementRef;
  @ViewChild('mappingUpload', {static: true}) mappingInput: ElementRef;

  cdmVersion: string;
  reportName: string;

  convertToCdmDisabled$: Observable<boolean>;

  reportGenerationDisabled$: Observable<boolean>;

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
    private dataService: DataService,
    private vocabularyObserverService: VocabularyObserverService,
    private reportGenerationService: ReportGenerationService,
    private authFacadeService: AuthFacadeService
  ) {
    super();
  }

  get isNotComfyPage() {
    return !this.router.url.includes('comfy')
  }

  get userInitials(): string {
    return this.authFacadeService.userInitials
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
        this.uploadService.onFileInputClick(this.reportInput);
      }
    });

    this.commonUtilsService.loadSourceMapping$.subscribe(res => {
      if (res) {
        this.uploadService.onFileInputClick(this.mappingInput);
      }
    });

    this.initStreamsOfDisabledButtons();

    this.subscribeOnReportConfigReady();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  goToComfy() {
    this.router.navigateByUrl(`${mainPageRouter}/comfy`);
  }

  IsCreateNewMappingDisabled() {
    return !(this.storeService.state.source.length || this.storeService.state.target.length);
  }

  resetAllMappings() {
    this.commonUtilsService.resetMappingsWithWarning();
  }

  openSaveMappingDialog() {
    this.commonUtilsService.saveMappingDialog();
  }

  openLoadMappingDialog() {
    this.uploadService.onFileInputClick(this.mappingInput);
  }

  onOpenSourceClick() {
    this.storeService.state.source.length ? this.commonUtilsService.loadNewReportWithWarning() : this.commonUtilsService.loadReportWithoutWarning();
  }

  onScanReportUpload(event) {
    const filesCount = event?.target?.files?.length ?? 0
    if (filesCount < 1) {
      return
    }
    this.bridgeService.reportLoading();
    this.uploadService.uploadScanReport(event.target.files[0])
      .subscribe(
        () => {},
        error => this.matDialog.open(ErrorPopupComponent, {
          data: {
            title: 'Failed to load new report',
            message: parseHttpError(error)
          },
          panelClass: 'perseus-dialog'
        })
      )
  }

  onEtlMappingUpload(event) {
    const filesCount = event?.target?.files?.length ?? 0
    if (filesCount < 1) {
      return
    }
    this.uploadService.uploadEtlMapping(event.target.files[0])
      .subscribe(
        () => {},
        error => this.matDialog.open(ErrorPopupComponent, {
          data: {
            title: 'Failed to open mapping',
            message: parseHttpError(error)
          },
          panelClass: 'perseus-dialog'
        })
      )
  }

  openSetCDMDialog() {
    this.commonUtilsService.openSetCDMDialog();
  }

  resetSourceAndTarget() {
    this.commonUtilsService.resetSourceAndTargetWithWarning();
  }

  openHelpPage() {
    this.matDialog.open(HelpPopupComponent, {
      panelClass: 'perseus-dialog'
    })
  }

  generateAndSave() {
    const {source} = this.storeService.getMappedTables();
    const areaRows = [];
    const sourceTables = this.bridgeService.prepareTables(source, Area.Source, areaRows);
    const mappingJSON = this.bridgeService.generateMappingWithViewsAndGroups(sourceTables);

    this.dataService.getZippedXml(mappingJSON).subscribe(file => saveAs(file));
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

  dataQualityCheck() {
    this.matDialog.open(DqdDialogComponent, {
      width: '700',
      height: '674',
      ...this.scanDataMatDialogSharedParams
    });
  }

  showVocabulary() {
    this.vocabularyObserverService.show = true;
  }

  generateReport() {
    this.reportGenerationService.emit(ReportGenerationEvent.PREPARE)
  }

  logout() {
    this.matDialog.open(LogoutComponent, {
      width: '301',
      height: '220',
      panelClass: 'perseus-dialog'
    });
  }

  codeMapping() {
    this.router.navigateByUrl(mainPageRouter + codesRouter)
  }

  private initStreamsOfDisabledButtons() {
    this.convertToCdmDisabled$ = this.storeService.state$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(state => state.mappingEmpty)
      );

    this.reportGenerationDisabled$ = this.storeService.state$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(state => !state.isMappingPage)
      );
  }

  private subscribeOnReportConfigReady() {
    this.reportGenerationService.reportConfigReady$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => this.reportGenerationService.generateReport(ReportType.WORD))
  }
}
