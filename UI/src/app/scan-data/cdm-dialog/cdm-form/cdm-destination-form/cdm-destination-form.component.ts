import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractResourceForm } from '../../../shared/abstract-resource-form/abstract-resource-form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cdmDbSettingsFromControlNames, createCdmDbSettingsForm } from '../../../util/form';
import { cdmBuilderDatabaseTypes } from '../../../scan-data.constants';

@Component({
  selector: 'app-cdm-destination-form',
  templateUrl: './cdm-destination-form.component.html',
  styleUrls: [
    '../cdm-form.component.scss',
    './cdm-destination-form.component.scss',
    '../../../styles/scan-data-connect-form.scss',
    '../../../styles/scan-data-step.scss',
    '../../../styles/scan-data-form.scss',
    '../../../styles/scan-data-buttons.scss',
    '../../../styles/scan-data-normalize.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdmDestinationFormComponent extends AbstractResourceForm implements OnInit {

  formControlNames = cdmDbSettingsFromControlNames;

  dataTypes = cdmBuilderDatabaseTypes;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  createForm(disabled: boolean): FormGroup {
    return createCdmDbSettingsForm(disabled, this.formBuilder);
  }
}
