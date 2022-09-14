import { AfterViewChecked, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CdmStateService } from '@services/cdm-builder/cdm-state.service';
import { BaseComponent } from '@shared/base/base.component';
import { FakeDataStateService } from '@services/white-rabbit/fake-data-state.service';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings';
import { CdmSourceFormComponent } from './cdm-source-form/cdm-source-form.component';
import { CdmDestinationFormComponent } from './cdm-destination-form/cdm-destination-form.component';
import { CdmSettings } from '@models/cdm-builder/cdm-settings';
import { StoreService } from '@services/store.service';
import { adaptCdmVersions } from '@utils/cdm-adapter';
import { Observable, of } from 'rxjs';
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service';
import { catchError, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DataBaseExistWarningPopupComponent } from '../../auxiliary/data-base-exist-warning-popup/data-base-exist-warning-popup.component';
import { CdmButtonsStateService } from '@services/cdm-builder/cdm-buttons-state.service'

@Component({
  selector: 'app-cdm-form',
  templateUrl: './cdm-form.component.html',
  styleUrls: [
    './cdm-form.component.scss',
    '../../styles/scan-data-buttons.scss',
    '../../styles/scan-data-normalize.scss'
  ]
})
export class CdmFormComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy {

  sourceDbSettings: DbSettings;

  destinationDbSettings: DbSettings;

  sourceDataType: string;

  destinationDataType: string;

  fakeDataParams: FakeDataSettings;

  formsInvalid = true;

  @Output()
  convert = new EventEmitter<CdmSettings>();

  @Output()
  generateFakeData = new EventEmitter<FakeDataSettings>();

  @Output()
  cancel = new EventEmitter<void>();

  @ViewChild(CdmSourceFormComponent)
  sourceFormComponent: CdmSourceFormComponent;

  @ViewChild(CdmDestinationFormComponent)
  destinationFormComponent: CdmDestinationFormComponent;

  constructor(private formBuilder: FormBuilder,
              private cdmStateService: CdmStateService,
              private fakeDataStateService: FakeDataStateService,
              private storeService: StoreService,
              private cdmBuilderService: CdmBuilderService,
              private matDialog: MatDialog,
              public cdmButtonsService: CdmButtonsStateService) {
    super();
  }

  get convertBtnDisabled(): boolean {
    return this.formsInvalid ||
      this.cdmButtonsService.converting ||
      this.cdmButtonsService.generatingFakeData
  }

  ngOnInit(): void {
    this.loadState();
  }

  ngAfterViewChecked(): void {
    // After checked child forms
    setTimeout(() => {
      this.formsInvalid = this.sourceFormComponent.isNotValid || this.destinationFormComponent.isNotValid;
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.saveState();
  }

  onConvert() {
    const settings = this.createCdmBuilderSettings();
    this.convert.emit(settings);
  }

  checkDestinationDatabase(settings: CdmSettings): Observable<boolean> {
    return this.cdmBuilderService.testDestinationConnection(settings)
      .pipe(
        switchMap(connectionResult => {
          if (connectionResult.canConnect) {
            return this.showDestinationDbExistWarningPopup();
          } else {
            return of(true);
          }
        }),
        catchError(() => of(true))
      );
  }

  private loadState() {
    const {sourceDbSettings, destinationDbSettings} = this.cdmStateService.state;
    const fakeDataParams = this.fakeDataStateService.state;
    this.sourceDataType = sourceDbSettings.dbType;
    this.destinationDataType = destinationDbSettings.dbType;
    this.sourceDbSettings = sourceDbSettings;
    this.destinationDbSettings = destinationDbSettings;
    this.fakeDataParams = fakeDataParams;
  }

  private saveState() {
    this.cdmStateService.state = {
      sourceDbSettings: {
        dbType: this.sourceFormComponent.dataType,
        ...this.sourceFormComponent.form.value
      },
      destinationDbSettings: {
        dbType: this.destinationFormComponent.dataType,
        ...this.destinationFormComponent.form.value
      }
    };
    this.fakeDataStateService.state = this.sourceFormComponent.fakeDataForm.value
  }

  private createCdmBuilderSettings(): CdmSettings {
    const cdmVersion = adaptCdmVersions(this.storeService.cdmVersion)
    const mappingsName = this.cdmBuilderService.getMappingName()

    return {
      ...this.sourceFormComponent.settings,
      ...this.destinationFormComponent.settings,
      mappingsName,
      cdmVersion
    };
  }

  private showDestinationDbExistWarningPopup(): Observable<boolean> {
    const dialogRef = this.matDialog.open(DataBaseExistWarningPopupComponent, {
      disableClose: true,
      panelClass: 'scan-data-dialog'
    });

    return dialogRef.afterClosed();
  }
}

