import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractResourceForm } from '../../../shared/abstract-resource-form/abstract-resource-form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cdmDbSettingsFromControlNames, createCdmDbSettingsForm, createFakeDataForm } from '../../../util/form';
import { cdmBuilderDatabaseTypes, fakeData } from '../../../scan-data.constants';
import { FakeDataParams } from '../../../model/fake-data-params';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdmSourceFormComponent extends AbstractResourceForm implements OnInit {

  @Input()
  fakeDataParams: FakeDataParams;

  formControlNames = cdmDbSettingsFromControlNames;

  fakeDataForm: FormGroup;

  dataTypes = [
    fakeData,
    ...cdmBuilderDatabaseTypes
  ];

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  get isSourceDbSettings() {
    if (!this.dbSettings) {
      return true;
    }

    return this.dataType !== fakeData;
  }

  ngOnInit() {
    super.ngOnInit();

    this.initFakeDataForm();
  }

  createForm(disabled: boolean): FormGroup {
    return createCdmDbSettingsForm(disabled, this.formBuilder);
  }

  private initFakeDataForm() {
    this.fakeDataForm = createFakeDataForm();
    this.fakeDataForm.patchValue(this.fakeDataParams);
  }
}
