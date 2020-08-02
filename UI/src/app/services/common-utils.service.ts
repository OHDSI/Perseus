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
import { OpenSaveDialogComponent } from '../components/popups/open-save-dialog/open-save-dialog.component';
import { ConfigurationService } from './configuration.service';

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
    private configService: ConfigurationService
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
      data: {action, target: this.storeService.state.targetConfig}
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
        dropdownLabel: 'Select Configuration',
        okButton: 'Open',
        items: this.configService.configurations.map(config => config.name),
        input: false}
    });
    matDialog.afterClosed().subscribe(res => {
      if (res) {
        this.configService.openConfiguration(res);
      }
    });
  }

  saveMappingDialog() {
    const matDialog = this.matDialog.open(OpenSaveDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'cdm-version-dialog',
      data: {
        header: 'Save Mapping',
        dropdownLabel: 'Name',
        okButton: 'Save',
        items: this.configService.configurations.map(config => config.name),
        input: true}
    });
    matDialog.afterClosed().subscribe(res => {
      if (res) {
        this.configService.saveConfiguration(res);
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
          this.openSaveMappingDialog('save', true);
          break;
        default: {
          this.bridgeService.resetAllMappings();
          if (settings.deleteAll) {
            this.storeService.resetAllData(); }
        }
      }
      this.router.navigateByUrl('/comfy');
    });
  }

  resetMappingsWithWarning() {
    const settings = {
      warning: 'You want to reset all mappings. This action cannot be undone',
      header: 'Delete mappings',
      okButton: 'Cancel',
      deleteButton: 'Delete',
      deleteAll: false,
    };
    this.openResetWarningDialog(settings);
  }

  resetSourceAndTargetWithWarning() {
    const settings = {
      warning: 'All mappings will be lost. Do you want to save created mappings?',
      header: 'Save mappings',
      okButton: 'Save',
      deleteButton: 'Delete',
      deleteAll: true
    };
    this.openResetWarningDialog(settings);
  }

}
