import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OpenMappingDialog } from '../app.component';
import { CdmVersionDialogComponent } from '../components/popups/cdm-version-dialog/cdm-version-dialog.component';
import { OpenMappingDialogComponent } from '../components/popups/open-mapping-dialog/open-mapping-dialog.component';
import { DataService } from './data.service';
import { StateService } from './state.service';
import { ResetWarningComponent } from '../components/popups/reset-warning/reset-warning.component';
import { BridgeService } from './bridge.service';
import { StoreService } from './store.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
  constructor(
    private matDialog: MatDialog,
    private stateService: StateService,
    private dataService: DataService,
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private router: Router,
  ) {

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
      data: {action, target: this.storeService.state['targetConfig']}
    });
    matDialog.afterClosed().subscribe(res => {
      if (deleteAfterSave) {
        this.bridgeService.resetAllMappings();
        this.storeService.resetAllData();
      }
      this.router.navigateByUrl('/comfy');
    });
  }

  openResetWarningDialog(
    warning: string,
    header: string,
    okButton: string,
    deleteButton: string,
    deleteAll: boolean) {
    const matDialog = this.matDialog.open(ResetWarningComponent, {
      data: {
        warningText: warning,
        headerText: header,
        okButtonText: okButton,
        deleteButtonText: deleteButton,
      },
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog',
    });

    matDialog.afterClosed().subscribe(res => {
      switch (res) {
        case '':
          return;
        case 'Cancel':
          return;
        case 'Save':
          this.openSaveMappingDialog('save', true);
          break;
        default: {
          this.bridgeService.resetAllMappings();
          if (deleteAll) {
            this.storeService.resetAllData(); }
        }
      }
      this.router.navigateByUrl('/comfy');
    });
  }
}
