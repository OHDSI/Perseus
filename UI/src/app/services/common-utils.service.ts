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

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
  private renderer: Renderer2;

  constructor(
    private overlayService: OverlayService,
    private matDialog: MatDialog,
    private dataService: DataService,
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private router: Router,
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
          this.openSaveMappingDialog('save', true);
          break;
        default: {
          this.bridgeService.resetAllMappings();
          if (settings.deleteAll) {
            this.storeService.resetAllData();
          }
        }
      }
      this.router.navigateByUrl('/comfy');
    });
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
