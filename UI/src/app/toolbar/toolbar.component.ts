import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BridgeService } from '@services/bridge.service';
import { CommonUtilsService } from '@services/common-utils.service';
import { etlMappingToProjectInfo, StoreService } from '@services/store.service';
import { UploadService } from '@services/upload.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { DqdDialogComponent } from '@scan-data/dqd-dialog/dqd-dialog.component';
import { BaseComponent } from '@shared/base/base.component';
import { VocabularyObserverService } from '@services/athena/vocabulary-observer.service';
import { ReportGenerationService } from '@services/report/report-generation.service';
import { codesRouter, isDev, mainPageName, mainPageRouter } from '../app.constants';
import { LogoutComponent } from '@popups/logout/logout.component';
import { HelpPopupComponent } from '@popups/help-popup/help-popup.component';
import { AuthFacadeService } from '@services/state/auth-facade.service';
import { openHttpErrorDialog } from '@utils/error'
import { isSourceUploaded, isTablesMapped, isViewCreated } from '@utils/mapping-util'
import { MatSnackBar } from '@angular/material/snack-bar'

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

  projectInitialized$: Observable<boolean>
  sourceUploaded$: Observable<boolean>
  tablesMapped$: Observable<boolean>

  isDev = isDev
  isComfyPage$: Observable<boolean>

  private scanDataMatDialogSharedParams = {
    disableClose: true,
    panelClass: 'scan-data-dialog'
  };

  constructor(
    public commonUtilsService: CommonUtilsService,
    private bridgeService: BridgeService,
    private uploadService: UploadService,
    private storeService: StoreService,
    private router: Router,
    private matDialog: MatDialog,
    private dataService: DataService,
    private vocabularyObserverService: VocabularyObserverService,
    private reportGenerationService: ReportGenerationService,
    private authFacadeService: AuthFacadeService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  get userInitials(): string {
    return this.authFacadeService.userInitials
  }

  ngOnInit() {
    this.storeService.on('etlMapping')
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(etlMapping => {
        const {cdmVersion, reportName} = etlMappingToProjectInfo(etlMapping);
        this.cdmVersion = cdmVersion;
        this.reportName = reportName;
      });

    this.commonUtilsService.loadReport$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(res => res)
      )
      .subscribe(() => this.uploadService.onFileInputClick(this.reportInput));

    this.commonUtilsService.loadMapping$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(res => res)
      )
      .subscribe(() => this.uploadService.onFileInputClick(this.mappingInput));

    this.isComfyPage$ = this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(event => event instanceof NavigationEnd),
        map(event => (event as NavigationEnd).url.includes(mainPageName))
      )

    this.initStreamsOfDisabledButtons();
  }

  goToComfy() {
    this.router.navigateByUrl(`${mainPageRouter}/comfy`);
  }

  onScanReportUpload(event) {
    const filesCount = event?.target?.files?.length ?? 0
    if (filesCount < 1) {
      return
    }
    this.uploadService.uploadScanReport(event.target.files[0])
      .subscribe(
        () => this.snackbar.open('Source schema loaded', ' DISMISS '),
        error => openHttpErrorDialog(this.matDialog, 'Failed to load new report', error)
      )
  }

  onEtlMappingUpload(event) {
    const filesCount = event?.target?.files?.length ?? 0
    if (filesCount < 1) {
      return
    }
    this.uploadService.uploadEtlMapping(event.target.files[0])
      .subscribe(
        () => this.snackbar.open('ETL mapping successfully loaded!', ' DISMISS '),
        error => openHttpErrorDialog(this.matDialog, 'Failed to open mapping', error)
      )
  }

  openHelpPage() {
    this.matDialog.open(HelpPopupComponent, {
      panelClass: 'perseus-dialog'
    })
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

  consoleLogStore() {
    console.log('Store:')
    console.log(this.storeService.state)

    console.log('Arrow Cache:')
    console.log(this.bridgeService.arrowsCache)

    console.log('Constant Cache:')
    console.log(this.bridgeService.constantsCache)
  }

  private initStreamsOfDisabledButtons() {
    this.projectInitialized$ = this.storeService.on('etlMapping').pipe(
      map(etlMapping => !!etlMapping?.id)
    )

    this.sourceUploaded$ = this.storeService.on('source').pipe(
      map(source => isSourceUploaded(source))
    )

    const tablesMapped$ = this.storeService.on('targetConfig').pipe(
      map(targetConfig => isTablesMapped(targetConfig))
    )
    const viewCreated$ = this.storeService.on('source').pipe(
      map(source => isViewCreated(source))
    )

    this.tablesMapped$ = combineLatest([tablesMapped$, viewCreated$]).pipe(
      map(([tablesMapped, viewCreated]) => tablesMapped || viewCreated)
    )
  }
}
