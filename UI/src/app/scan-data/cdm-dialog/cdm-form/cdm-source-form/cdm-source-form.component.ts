import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractResourceForm } from '../../../shared/abstract-resource-form/abstract-resource-form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cdmDbSettingsFromControlNames, createCdmDbSettingsForm, createFakeDataForm } from '../../../util/form';
import { cdmBuilderDatabaseTypes, dictionaryDbSettingForCdmBuilder, fakeData } from '../../../scan-data.constants';
import { FakeDataParams } from '../../../model/fake-data-params';
import { CdmBuilderService } from '../../../../services/cdm-builder.service';
import { adaptDbSettingsForSource } from '../../../util/cdm-adapter';
import { CdmSettings } from '../../../model/cdm-settings';
import { MatDialog } from '@angular/material/dialog';

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
export class CdmSourceFormComponent extends AbstractResourceForm implements OnInit {

  @Input()
  fakeDataParams: FakeDataParams;

  @Output()
  generateFakeData = new EventEmitter<FakeDataParams>();

  formControlNames = cdmDbSettingsFromControlNames;

  fakeDataForm: FormGroup;

  dataTypes = [
    fakeData,
    ...cdmBuilderDatabaseTypes
  ];

  constructor(formBuilder: FormBuilder, matDialog: MatDialog, private cdmBuilderService: CdmBuilderService) {
    super(formBuilder, matDialog);
  }

  get settings() {
    const dbType = this.dataType;
    return {
      ...dictionaryDbSettingForCdmBuilder,
      ...adaptDbSettingsForSource({dbType, ...this.form.value})
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
    this.cdmBuilderService.testSourceConnection(this.settings as CdmSettings)
      .subscribe(
        result => this.connectionResult = result,
        error => {
          this.connectionResult = {
            canConnect: false,
            message: error.error,
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
    return createCdmDbSettingsForm(disabled, this.formBuilder);
  }

  private initFakeDataForm() {
    this.fakeDataForm = createFakeDataForm();
    this.fakeDataForm.patchValue(this.fakeDataParams);
  }
}
