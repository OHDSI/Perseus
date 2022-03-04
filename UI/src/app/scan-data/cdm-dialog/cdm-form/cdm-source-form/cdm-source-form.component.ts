import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractResourceFormComponent } from '../../../auxiliary/resource-form/abstract-resource-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { createDbConnectionForm, createFakeDataForm } from '@utils/form';
import { cdmBuilderDatabaseTypes, dictionaryDbSettingForCdmBuilder, fakeData } from '../../../scan-data.constants';
import { FakeDataParams } from '@models/scan-data/fake-data-params';
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service';
import { adaptDbSettingsForSource } from '@utils/cdm-adapter';
import { CdmSettings } from '@models/cdm-builder/cdm-settings';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { hasLimits } from '@utils/scan-data-util';
import { CdmStateService } from '@services/cdm-builder/cdm-state.service';

@Component({
  selector: 'app-cdm-source-form',
  templateUrl: './cdm-source-form.component.html',
  styleUrls: [
    './cdm-source-form.component.scss',
    '../cdm-form.component.scss',
    '../../../styles/scan-data-connect-form.scss',
    '../../../styles/scan-data-step.scss',
    '../../../styles/scan-data-form.scss',
    '../../../styles/scan-data-buttons.scss',
    '../../../styles/scan-data-normalize.scss'
  ]
})
export class CdmSourceFormComponent extends AbstractResourceFormComponent implements OnInit {

  @Input()
  fakeDataParams: FakeDataParams;

  @Output()
  generateFakeData = new EventEmitter<FakeDataParams>();

  fakeDataForm: FormGroup;

  dataTypes = [
    fakeData,
    ...cdmBuilderDatabaseTypes
  ];

  constructor(formBuilder: FormBuilder,
              matDialog: MatDialog,
              private cdmBuilderService: CdmBuilderService,
              private cdmStateService: CdmStateService) {
    super(formBuilder, matDialog);
  }

  get settings() {
    const dbType = this.dataType;
    const dbSettings = {dbType, ...this.form.value}

    return {
      ...dictionaryDbSettingForCdmBuilder,
      ...adaptDbSettingsForSource(dbSettings)
    };
  }

  get isNotValid() {
    return this.isSourceDbSettings ? !this.form.valid : !this.fakeDataForm.valid;
  }

  get isSourceDbSettings() {
    if (!this.dbSettings) {
      return true;
    }

    return this.dataType !== fakeData;
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.fakeDataParams) {
      this.initFakeDataForm();
    }
  }

  onTestConnection(): void {
    const errorParser = error => {
      if (typeof error.error === 'string') {
        return error.error;
      } else if (error.message) {
        return error.message;
      } else {
        return 'Can not connect to database server';
      }
    };

    this.tryConnect = true;
    this.cdmBuilderService.testSourceConnection(this.settings as CdmSettings)
      .pipe(
        finalize(() => this.tryConnect = false)
      )
      .subscribe(
        result => {
          this.connectionResult = result;
          this.subscribeFormChange();
        },
        error => {
          this.connectionResult = {
            canConnect: false,
            message: errorParser(error),
          };
          this.showErrorPopup(this.connectionResult.message);
        }
      );
  }

  isDbTypeDisable(dataType: string): boolean {
    if (dataType !== fakeData) {
      return false;
    }

    return this.fakeDataParams === null;
  }

  createForm(disabled: boolean): FormGroup {
    return createDbConnectionForm(disabled, this.requireSchema, this.formBuilder);
  }

  hasLimits(type: string): string | null {
    return hasLimits(type)
  }

  onDataTypeChange(value: string) {
    super.onDataTypeChange(value);
    this.cdmStateService.sourceDataType = value;
  }

  private initFakeDataForm() {
    this.fakeDataForm = createFakeDataForm();
    this.fakeDataForm.patchValue(this.fakeDataParams);
  }
}
