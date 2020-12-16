import { Component, OnInit } from '@angular/core';
import { AbstractResourceForm } from '../../../shared/abstract-resource-form/abstract-resource-form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cdmDbSettingsFromControlNames, createCdmDbSettingsForm } from '../../../util/form';
import { cdmBuilderDatabaseTypes, dictionaryDbSettingForCdmBuilder } from '../../../scan-data.constants';
import { adaptDbSettingsForDestination } from '../../../util/cdm-adapter';
import { CdmSettings } from '../../../model/cdm-settings';
import { CdmBuilderService } from '../../../../services/cdm-builder.service';
import { MatDialog } from '@angular/material/dialog';

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
  ]
})
export class CdmDestinationFormComponent extends AbstractResourceForm implements OnInit {

  formControlNames = cdmDbSettingsFromControlNames;

  dataTypes = cdmBuilderDatabaseTypes;

  constructor(formBuilder: FormBuilder, matDialog: MatDialog, private cdmBuilderService: CdmBuilderService) {
    super(formBuilder, matDialog);
  }

  get settings() {
    const dbType = this.dataType;
    return  {
      ...dictionaryDbSettingForCdmBuilder,
      ...adaptDbSettingsForDestination({dbType, ...this.form.value})
    };
  }

  get isNotValid() {
    return !this.form.valid;
  }

  createForm(disabled: boolean): FormGroup {
    return createCdmDbSettingsForm(disabled, this.formBuilder);
  }

  onTestConnection() {
    this.cdmBuilderService.testDestinationConnection(this.settings as CdmSettings)
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
}
