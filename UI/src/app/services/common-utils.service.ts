import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OpenMappingDialog } from '../app.component';
import { CdmVersionDialogComponent } from '../components/popups/cdm-version-dialog/cdm-version-dialog.component';
import { OpenMappingDialogComponent } from '../components/popups/open-mapping-dialog/open-mapping-dialog.component';
import { DataService } from './data.service';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
  constructor(
    private matDialog: MatDialog,
    private stateService: StateService,
    private dataService: DataService,
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

  openSaveMappingDialog(action: OpenMappingDialog) {
    const matDialog = this.matDialog.open(OpenMappingDialogComponent, {
      closeOnNavigation: true,
      disableClose: true,
      data: {action, target: this.stateService.Target}
    });
  }
}
