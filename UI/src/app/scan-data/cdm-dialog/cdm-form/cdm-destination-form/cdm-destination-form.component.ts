import { Component, OnInit } from '@angular/core';
import { AbstractResourceFormComponent } from '../../../auxiliary/resource-form/abstract-resource-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { createDbConnectionForm } from '@utils/form';
import { cdmBuilderDatabaseTypes } from '../../../scan-data.constants';
import { adaptDbSettingsForDestination } from '@utils/cdm-adapter';
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs'

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
export class CdmDestinationFormComponent extends AbstractResourceFormComponent implements OnInit {

  dataTypes = cdmBuilderDatabaseTypes;

  private testConnectionSub: Subscription

  constructor(formBuilder: FormBuilder, matDialog: MatDialog, private cdmBuilderService: CdmBuilderService) {
    super(formBuilder, matDialog);
  }

  get settings() {
    return adaptDbSettingsForDestination({dbType: this.dataType, ...this.form.value})
  }

  get isNotValid() {
    return !this.form.valid;
  }

  createForm(disabled: boolean): FormGroup {
    return createDbConnectionForm(disabled, this.requireSchema, this.formBuilder);
  }

  onTestConnection() {
    const cdmSettings = this.settings
    this.form.disable();
    this.tryConnect = true;
    this.testConnectionSub = this.cdmBuilderService.testDestinationConnection(cdmSettings)
      .pipe(
        finalize(() => {
          this.tryConnect = false;
          this.form.enable({emitEvent: false});
        })
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

  cancelTestConnection() {
    this.testConnectionSub.unsubscribe()
  }
}
