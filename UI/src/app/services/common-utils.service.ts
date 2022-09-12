import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { CdmVersionDialogComponent } from '@popups/cdm-version-dialog/cdm-version-dialog.component';
import { ResetWarningComponent } from '@popups/reset-warning/reset-warning.component';
import { BridgeService } from './bridge.service';
import { EtlConfigurationService } from './etl-configuration.service';
import { DataService } from './data.service';
import { initialState, StoreService } from './store.service';
import { mainPageRouter } from '@app/app.constants';
import { SaveMappingDialogComponent } from '@popups/save-mapping-dialog/save-mapping-dialog.component'
import { openErrorDialog, parseHttpError } from '@utils/error'
import { ResetWarningData } from '@models/reset-warning-data'
import { ScanDataDialogComponent } from '@scan-data/scan-data-dialog/scan-data-dialog.component'
import { isSourceUploaded, isTablesMapped, isTablesMappedOrViewCreated } from '@utils/mapping-util'
import { FakeDataDialogComponent } from '@scan-data/fake-data-dialog/fake-data-dialog.component'
import { CdmDialogComponent } from '@scan-data/cdm-dialog/cdm-dialog.component'
import { PersonMappingWarningDialogComponent } from '@shared/person-mapping-warning-dialog/person-mapping-warning-dialog.component'
import { Area } from '@models/area'
import { saveAs } from 'file-saver';
import { ReportGenerationService } from '@services/report/report-generation.service'

@Injectable()
export class CommonUtilsService {
  private readonly loadReport = new BehaviorSubject<boolean>(false);
  private readonly loadMapping = new BehaviorSubject<boolean>(false);

  constructor(
    private matDialog: MatDialog,
    private dataService: DataService,
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private router: Router,
    private configService: EtlConfigurationService,
    private snackbar: MatSnackBar,
    private reportGenerationService: ReportGenerationService
  ) {}

  get loadReport$(): Observable<boolean> {
    return this.loadReport.asObservable()
  }

  get loadMapping$(): Observable<boolean> {
    return this.loadMapping.asObservable()
  }

  createNewMapping(): void {
    const settings = {
      warning: 'All the changes in current mapping will be lost. Save your current mapping before creating new one?',
      header: 'Save mapping',
      okButton: 'Save',
      deleteButton: 'Don\'t Save',
    };
    this.openWarningDialog(settings, {width: '376px', height: '238px'})
      .pipe(
        switchMap(result => result === settings.okButton ? this.openSaveMappingDialog() : of(null))
      )
      .subscribe(() => this.deleteMappingAndReturnToComfy())
  }

  scanData(): void {
    const settings = {
      width: '700',
      height: '674',
      disableClose: true,
      panelClass: 'scan-data-dialog'
    }
    this.matDialog.open(ScanDataDialogComponent, settings);
  }

  uploadScanDataReport(): void {
    const state = this.storeService.state
    if (isSourceUploaded(state.source) && isTablesMappedOrViewCreated(state.targetConfig, state.source)) {
      const settings = {
        warning: 'You want to load a new report. All unsaved changes will be lost. Are you sure?',
        header: 'Load new report',
        okButton: 'Confirm',
        deleteButton: 'Cancel'
      }
      this.openWarningDialog(settings, {width: '280px', height: '244px'})
        .pipe(
          map(result => result === settings.okButton)
        )
        .subscribe(result => this.loadReport.next(result))
    } else {
      this.loadReport.next(true);
    }
  }

  resetMapping(): void {
    const settings = {
      warning: 'You want to reset mapping. This action cannot be undone.',
      header: 'Reset mapping',
      okButton: 'Reset',
      deleteButton: 'Cancel',
    };
    this.openWarningDialog(settings, {width: '271px', height: '235px'})
      .pipe(
        filter(result => result === settings.okButton)
      )
      .subscribe(() => {
        this.resetMappingDataAndReturnToComfy()
        this.snackbar.open('Mapping successfully reset!', ' DISMISS ');
      })
  }

  setCdmVersion(): void {
    let before$: Observable<any>
    if (isTablesMapped(this.storeService.state.targetConfig)) {
      const settings = {
        warning: 'All the changes in current mapping will be lost. Are you sure?',
        header: 'Set CDM version',
        okButton: 'Confirm',
        deleteButton: 'Cancel',
      }
      before$ = this.openWarningDialog(settings, {width: '298px', height: '234px'}).pipe(
        filter(result => result === settings.okButton)
      )
    } else {
      before$ = of(null)
    }

    before$.pipe(
      switchMap(() => this.matDialog.open(CdmVersionDialogComponent, {
        closeOnNavigation: false,
        disableClose: false,
        panelClass: 'cdm-version-dialog',
      }).afterClosed()),
      filter(res => res),
      tap(() => this.resetMappingDataAndReturnToComfy(false)),
      switchMap(res => this.dataService.setCdmVersionAndGetTargetData(res))
    ).subscribe(
      () => this.openSnackbarMessage('Target schema loaded'),
      error => openErrorDialog(this.matDialog, 'Can not load target schema', parseHttpError(error))
    )
  }

  saveMapping(): void {
    const matDialog = this.matDialog.open(SaveMappingDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'cdm-version-dialog'
    });
    matDialog.afterClosed().pipe(
      filter(res => res)
    ).subscribe(res => this.openSnackbarMessage(res))
  }

  openMapping(): void {
    const state = this.storeService.state
    if (isSourceUploaded(state.source) && isTablesMappedOrViewCreated(state.targetConfig, state.source)) {
      const settings = {
        warning: 'You want to open new mapping. All unsaved changes will be lost. Are you sure?',
        header: 'Open mapping',
        okButton: 'Confirm',
        deleteButton: 'Cancel'
      }
      this.openWarningDialog(settings, {width: '285px', height: '244px'})
        .pipe(
          map(result => result === settings.okButton)
        )
        .subscribe(result => this.loadMapping.next(result))
    } else {
      this.loadMapping.next(true)
    }
  }

  openWarningDialog(settings: ResetWarningData, size = {width: '268px', height: '254px'}): Observable<string> {
    return this.matDialog.open(ResetWarningComponent, {
      data: settings,
      closeOnNavigation: false,
      disableClose: true,
      panelClass: 'warning-dialog',
      ...size
    }).afterClosed().pipe(
      filter(result => !!result)
    )
  }

  resetMappingDataAndReturnToComfy(deleteView = true): void {
    this.bridgeService.reset();
    const state = this.storeService.state
    const targetConfig = state.targetConfig
    Object.values(targetConfig).forEach(item => {
      item.data = [item.first];
    });
    this.storeService.state = {
      ...initialState,
      cdmVersions: state.cdmVersions,
      etlMapping: state.etlMapping,
      source: deleteView ? state.source.filter(table => !table.sql) : state.source,
      target: state.target,
      targetConfig: {...targetConfig}
    }
    this.router.navigateByUrl(`${mainPageRouter}/comfy`);
  }

  generateFakeData(): void {
    this.matDialog.open(FakeDataDialogComponent, {
      width: '253',
      height: '270',
      disableClose: true,
      panelClass: 'scan-data-dialog'
    })
  }

  convertToCdm(): void {
    this.checkIsPersonMapped()
      .pipe(filter(res => res))
      .subscribe(() => this.matDialog.open(CdmDialogComponent, {
        width: '700',
        height: '674',
        disableClose: true,
        panelClass: 'scan-data-dialog'
      }))
  }

  generateAndSaveFiles(): void {
    const {source} = this.storeService.getMappedTables();
    const mappedSource = this.bridgeService.prepareTables(source, Area.Source, [])
    const mappingJSON = this.bridgeService.generateMappingWithViewsAndGroups(mappedSource)

    this.dataService.getZippedXml(mappingJSON).subscribe(file => saveAs(file))
  }

  async generateReportFile(): Promise<void> {
    const {source} = this.storeService.getMappedTables()
    const mappedSource = this.bridgeService.prepareTables(source, Area.Source, [])
    const mappingConfig = this.storeService.mappingConfig()
    await this.reportGenerationService.generateReport(mappedSource, mappingConfig)
  }

  fieldsNotMapped() {
    return Object.keys(this.bridgeService.arrowsCache).length === 0;
  }

  private deleteMappingAndReturnToComfy(): void {
    this.bridgeService.reset();
    this.storeService.reset();
    this.router.navigateByUrl(`${mainPageRouter}/comfy`);
  }

  private openSaveMappingDialog(): Observable<void> {
    return this.matDialog.open(SaveMappingDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'cdm-version-dialog'
    }).afterClosed()
      .pipe(
        filter(result => !!result),
        tap(result => this.openSnackbarMessage(result))
      )
  }

  private openSnackbarMessage(message: string) {
    this.snackbar.open(message, ' DISMISS ');
  }

  private checkIsPersonMapped(): Observable<boolean> {
    const mapping = this.bridgeService.generateMappingModelForZipXml();
    const mandatoryPersonFields = [
      'person_id',
      'person_source_value'
    ]
    const personMapped = mapping.mapping_items
      .find(mappingPair =>
        mappingPair.target_table.toLowerCase() === 'person' &&
        mandatoryPersonFields.every(field => mappingPair.mapping
          .find(mappingNode => mappingNode.target_field.toLowerCase() === field)
        )
      )
    if (personMapped) {
      return of(true)
    } else {
      return this.matDialog
        .open(PersonMappingWarningDialogComponent, {panelClass: 'perseus-dialog'})
        .afterClosed()
    }
  }
}
