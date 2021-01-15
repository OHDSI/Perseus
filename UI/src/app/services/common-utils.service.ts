import { Injectable, Renderer2, RendererFactory2, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { OpenMappingDialog } from '../app.component';
import { CdmVersionDialogComponent } from '../components/popups/cdm-version-dialog/cdm-version-dialog.component';
import { DeleteWarningComponent } from '../components/popups/delete-warning/delete-warning.component';
import { OnBoardingComponent } from '../components/popups/on-boarding/on-boarding.component';
import { OpenMappingDialogComponent } from '../components/popups/open-mapping-dialog/open-mapping-dialog.component';
import { OpenSaveDialogComponent } from '../components/popups/open-save-dialog/open-save-dialog.component';
import { ResetWarningComponent } from '../components/popups/reset-warning/reset-warning.component';
import { BridgeService } from './bridge.service';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { OverlayConfigOptions } from './overlay/overlay-config-options.interface';
import { OverlayService } from './overlay/overlay.service';
import { StoreService } from './store.service';
import { UploadService } from './upload.service';
import * as fileSaver from 'file-saver';
import { Configuration } from '../models/configuration';



@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
  private renderer: Renderer2;
  private readonly loadReport = new BehaviorSubject<any>(true);
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
    rendererFactory: RendererFactory2,
    private uploadService: UploadService,
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

  openSaveMappingDialog(action: OpenMappingDialog, deleteAfterSave: boolean) {
    const matDialog = this.matDialog.open(OpenMappingDialogComponent, {
      closeOnNavigation: true,
      disableClose: true,
      data: { action, target: this.storeService.state.targetConfig }
    });
    matDialog.afterClosed().subscribe(res => {
      if (deleteAfterSave) {
        this.bridgeService.resetAllMappings();
        this.storeService.resetAllData();
      }
      this.router.navigateByUrl(`/comfy`);
    });
  }

  loadMappingDialog() {
    const matDialog = this.matDialog.open(OpenSaveDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'cdm-version-dialog',
      data: {
        header: 'Open Mapping',
        label: 'Select Configuration',
        okButton: 'Open',
        items: this.configService.configurations.map(config => config.name),
        type: 'select'
      }
    });
    matDialog.afterClosed().subscribe(res => {
      if (res) {
        const message = this.configService.openConfiguration(res.value);
        this.openSnackbarMessage(message);
      }
    });
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
        items: this.configService.configurations.map(config => config.name),
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
    const dialog = this.matDialog.open(DeleteWarningComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog',
      data: {
        title: 'View',
        message: 'You want to delete the view'
      }
    });

    return dialog;
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
