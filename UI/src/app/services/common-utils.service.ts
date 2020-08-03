import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { OpenMappingDialog } from '../app.component';
import { CdmVersionDialogComponent } from '../components/popups/cdm-version-dialog/cdm-version-dialog.component';
import { OnBoardingComponent } from '../components/popups/on-boarding/on-boarding.component';
import { OpenMappingDialogComponent } from '../components/popups/open-mapping-dialog/open-mapping-dialog.component';
import { ResetWarningComponent } from '../components/popups/reset-warning/reset-warning.component';
import { BridgeService } from './bridge.service';
import { DataService } from './data.service';
import { OverlayConfigOptions } from './overlay/overlay-config-options.interface';
import { OverlayService } from './overlay/overlay.service';
import { StoreService } from './store.service';
import { OpenSaveDialogComponent } from '../components/popups/open-save-dialog/open-save-dialog.component';
import { ConfigurationService } from './configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {

  private snakbarOptions = {
    duration: 3000
  };

  private renderer: Renderer2;

  constructor(
    private overlayService: OverlayService,
    private matDialog: MatDialog,
    private dataService: DataService,
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private router: Router,
    private configService: ConfigurationService,
    private snakbar: MatSnackBar,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
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
      this.router.navigateByUrl('/comfy');
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
        type: 'select'}
    });
    matDialog.afterClosed().subscribe(res => {
      if (res) {
        const message = this.configService.openConfiguration(res.value);
        this.openSnackbarMessage(message);
      }
    });
  }

  saveMappingDialog(deleteSourceAndTargetAfterSave: boolean) {
    const matDialog = this.matDialog.open(OpenSaveDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'cdm-version-dialog',
      data: {
        header: 'Save Mapping',
        label: 'Name',
        okButton: 'Save',
        items: this.configService.configurations.map(config => config.name),
        type: 'input'}
    });
    matDialog.afterClosed().subscribe(res => {
      if (res.action) {
        const message = this.configService.saveConfiguration(res.value);
        this.openSnackbarMessage(message);
        if (deleteSourceAndTargetAfterSave) {
          this.resetMappingsAndReturnToComfy(true);
        }
      }
    });
  }

  openResetWarningDialog(settings: any) {
    const { warning, header, okButton, deleteButton } = settings;
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
        case 'Save':
          this.saveMappingDialog(true);
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
      this.router.navigateByUrl('/comfy');
    }
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

  openSnackbarMessage(message: string) {
    this.snakbar.open(
      message,
      ' DISMISS ',
      this.snakbarOptions
    );
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
