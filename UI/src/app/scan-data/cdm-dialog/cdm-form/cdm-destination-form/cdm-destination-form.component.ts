import { Component, OnInit } from '@angular/core';
import { AbstractResourceForm } from '../../../auxiliary/resource-form/abstract-resource-form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { createDbConnectionForm } from '@utils/form';
import { cdmBuilderDatabaseTypes, dictionaryDbSettingForCdmBuilder } from '../../../scan-data.constants';
import { adaptDbSettingsForDestination } from '@utils/cdm-adapter';
import { CdmSettings } from '@models/scan-data/cdm-settings';
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

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
    return createDbConnectionForm(disabled, this.requireSchema, this.formBuilder);
  }

  onTestConnection() {
    this.tryConnect = true;
    this.cdmBuilderService.testDestinationConnection(this.settings as CdmSettings)
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
            message: error.error,
          };
          this.showErrorPopup(this.connectionResult.message);
        }
      );
  }
}
