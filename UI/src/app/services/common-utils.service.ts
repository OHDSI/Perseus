import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CdmVersionDialogComponent } from '@popups/cdm-version-dialog/cdm-version-dialog.component';
import { DeleteWarningComponent } from '@popups/delete-warning/delete-warning.component';
import { OnBoardingComponent } from '@popups/on-boarding/on-boarding.component';
import { OpenSaveDialogComponent } from '@popups/open-save-dialog/open-save-dialog.component';
import { ResetWarningComponent } from '@popups/reset-warning/reset-warning.component';
import { BridgeService } from './bridge.service';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { OverlayConfigOptions } from './overlay/overlay-config-options.interface';
import { OverlayService } from './overlay/overlay.service';
import { StoreService } from './store.service';

@Injectable()
export class CommonUtilsService {
  private renderer: Renderer2;
  private readonly loadReport = new BehaviorSubject<any>(false);
  readonly loadSourceReport$ = this.loadReport.asObservable();

  constructor(
    private overlayService: OverlayService,
    private matDialog: MatDialog,
    private dataService: DataService,
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private router: Router,
    private configService: ConfigurationService,
    private snackbar: MatSnackBar,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }


  findTableByKeyValue(tables, key, value) {
    return tables.find(it => it[ key ] === value);
  }

  openSetCDMDialog() {
    const matDialog = this.matDialog.open(CdmVersionDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'cdm-version-dialog',
    });

    matDialog.afterClosed().pipe(
      mergeMap(res1 => {
        if (res1) {
          return this.dataService.getTargetData(res1);
        }
        return of(false);
      })
    ).subscribe();
  }

  saveMappingDialog(deleteSourceAndTargetAfterSave: boolean, loadReport: boolean) {
    const matDialog = this.matDialog.open(OpenSaveDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'cdm-version-dialog',
      data: {
        header: 'Save Mapping',
        label: 'Name',
        okButton: 'Save',
        type: 'input'
      }
    });
    matDialog.afterClosed().subscribe(res => {
      if (res.action) {
        const message = this.configService.saveConfiguration(res.value);
        this.openSnackbarMessage(message);
        if (deleteSourceAndTargetAfterSave) {
          this.resetMappingsAndReturnToComfy(true);
        }
        if (loadReport) {
          this.loadReportAndReturnToComfy();
        }
      }
    });
  }


  openResetWarningDialog(settings: any) {
    const { warning, header, okButton, deleteButton, deleteSourceAndTarget, loadReport } = settings;
    const matDialog = this.matDialog.open(ResetWarningComponent, {
      data: { warning, header, okButton, deleteButton },
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog',
    });

    matDialog.afterClosed().subscribe(res => {
      switch (res) {
        case '':
        case 'Cancel':
          return;
        case 'Don\'t save':
          this.loadReportAndReturnToComfy();
          return;
        case 'Save':
          this.saveMappingDialog(deleteSourceAndTarget, loadReport);
          break;
        default: {
          this.resetMappingsAndReturnToComfy(settings.deleteSourceAndTarget);
        }
      }
    });
  }

  resetMappingsAndReturnToComfy(deleteSourceAndTarget: boolean) {
    this.bridgeService.resetAllMappings();
    if (deleteSourceAndTarget) {
      this.storeService.resetAllData();
      this.router.navigateByUrl(`/comfy`);
    }
  }

  loadReportAndReturnToComfy() {
    this.router.navigateByUrl(`/comfy`);
    this.refreshCDM();
    this.loadReport.next(true);
  }

  loadReportWithoutWarning() {
    this.loadReport.next(true);
  }

  refreshCDM() {
    this.storeService.state.targetClones = {};
    this.dataService.getTargetData(this.storeService.state.version).subscribe();
  }

  resetMappingsWithWarning() {
    const settings = {
      warning: 'You want to reset all mappings. This action cannot be undone',
      header: 'Delete mappings',
      okButton: 'Cancel',
      deleteButton: 'Delete',
      deleteSourceAndTarget: false,
    };
    this.openResetWarningDialog(settings);
  }

  resetSourceAndTargetWithWarning() {
    const settings = {
      warning: 'All mappings will be lost. Do you want to save created mappings?',
      header: 'Save mappings',
      okButton: 'Save',
      deleteButton: 'Delete',
      deleteSourceAndTarget: true
    };
    this.openResetWarningDialog(settings);
  }

  loadNewReportWithWarning() {
    const settings = {
      warning: 'You want to load a new report. All changes will be lost. Do you want to save current mappings?',
      header: 'Load new report',
      okButton: 'Save',
      deleteButton: 'Don\'t save',
      deleteSourceAndTarget: false,
      loadReport: true
    };
    this.openResetWarningDialog(settings);
  }

  deleteTableWithWarning() {
    return this.matDialog.open(DeleteWarningComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog',
      data: {
        title: 'View',
        message: 'You want to delete the view'
      }
    });
  }

  openSnackbarMessage(message: string) {
    this.snackbar.open(message, ' DISMISS ');
  }

  openOnBoardingTip(target: EventTarget, key) {
    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'on-boarding-backdrop',
      panelClass: 'on-boarding-bottom',
      payload: { key },
      positionStrategyFor: key
    };
    const dialogRef = this.overlayService.open(dialogOptions, target, OnBoardingComponent);
    this.renderer.addClass(target, 'on-boarding-anchor');
    dialogRef.afterClosed$.subscribe(configOptions => this.renderer.removeClass(target, 'on-boarding-anchor'));
  }
}
