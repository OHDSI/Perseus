import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BridgeService } from '../services/bridge.service';
import { CommonUtilsService } from '../services/common-utils.service';
import { stateToInfo, StoreService } from '../services/store.service';
import { UploadService } from '../services/upload.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { map, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Area } from 'src/app/models/area';
import { ScanDataDialogComponent } from '../scan-data/scan-data-dialog/scan-data-dialog.component';
import { FakeDataDialogComponent } from '../scan-data/fake-data-dialog/fake-data-dialog.component';
import { Observable } from 'rxjs/internal/Observable';
import { CdmDialogComponent } from '../scan-data/cdm-dialog/cdm-dialog.component';
import { DqdDialogComponent } from '../scan-data/dqd-dialog/dqd-dialog.component';
import { BaseComponent } from '../shared/base/base.component';
import { VocabularyObserverService } from '../services/vocabulary-search/vocabulary-observer.service';
import { ReportGenerationEvent, ReportGenerationService, ReportType } from '../services/report-generation.service';
import { codesRouter, mainPageRouter } from '../app.constants';
import { LogoutComponent } from '../popups/logout/logout.component';
import { ErrorPopupComponent } from '../popups/error-popup/error-popup.component';
import { HelpPopupComponent } from '../popups/help-popup/help-popup.component';
import { authInjector } from '../services/auth/auth-injector';
import { AuthService } from '../services/auth/auth.service';

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

  fakeDataDisabled$: Observable<boolean>;

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
    @Inject(authInjector) private authService: AuthService
  ) {
    super();
  }

  get isNotComfyPage() {
    return !this.router.url.includes('comfy')
  }

  get userInitials(): string {
    const {firstName = '?', lastName = '?'} = this.authService.user
    return `${firstName[0]}${lastName[0]}`
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

    this.initStreamsOfDisabledButtons();

    this.subscribeOnReportConfigReady();

    this.showVocabulary()
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
    this.commonUtilsService.saveMappingDialog(false, false);
  }

  openLoadMappingDialog() {
    this.uploadService.onFileInputClick(this.mappingInput);
  }

  onOpenSourceClick() {
    this.storeService.state.source.length ? this.commonUtilsService.loadNewReportWithWarning() : this.commonUtilsService.loadReportWithoutWarning();
  }

  onFileUpload(event: Event) {
    this.bridgeService.reportLoading();
    this.uploadService.onScanReportChange(event)
      .subscribe(
        () => {},
        error => this.matDialog.open(ErrorPopupComponent, {
          data: {
            title: 'Failed to load new report',
            message: error.message
          },
          panelClass: 'scan-data-dialog'
        })
      )
  }

  onMappingUpload(event: Event) {
    this.uploadService.onMappingChange(event)
      .subscribe(
        () => {},
        error => this.matDialog.open(ErrorPopupComponent, {
          data: {
            title: 'Failed to open mapping',
            message: error.message
          },
          panelClass: 'scan-data-dialog'
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
    this.fakeDataDisabled$ = this.storeService.state$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(state => !state.reportFile)
      );

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
