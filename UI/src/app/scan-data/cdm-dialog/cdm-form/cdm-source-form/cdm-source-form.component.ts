import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractResourceFormComponent } from '../../../auxiliary/resource-form/abstract-resource-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { createDbConnectionForm, createFakeDataForm } from '@utils/form';
import { cdmBuilderDatabaseTypes, fakeData } from '../../../scan-data.constants';
import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings';
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service';
import { adaptDbSettingsForSource } from '@utils/cdm-adapter';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { hasLimits } from '@utils/scan-data-util';
import { CdmStateService } from '@services/cdm-builder/cdm-state.service';
import { parseHttpError } from '@utils/error'
import { Subscription } from 'rxjs'

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
  fakeDataParams: FakeDataSettings;

  @Output()
  generateFakeData = new EventEmitter<FakeDataSettings>();

  fakeDataForm: FormGroup;

  dataTypes = [
    fakeData,
    ...cdmBuilderDatabaseTypes
  ];

  private testConnectionSub: Subscription

  constructor(formBuilder: FormBuilder,
              matDialog: MatDialog,
              private cdmBuilderService: CdmBuilderService,
              private cdmStateService: CdmStateService) {
    super(formBuilder, matDialog);
  }

  get settings() {
    return this.isSourceDbSettings ?
      adaptDbSettingsForSource({dbType: this.dataType, ...this.form.value}) :
      {}
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
    const cdmSettings = adaptDbSettingsForSource({dbType: this.dataType, ...this.form.value});
    this.form.disable();
    this.tryConnect = true;
    this.testConnectionSub =  this.cdmBuilderService.testSourceConnection(cdmSettings)
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
            message: parseHttpError(error),
          };
          this.showErrorPopup(this.connectionResult.message);
        }
      );
  }

  cancelTestConnection(): void {
    this.testConnectionSub.unsubscribe();
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
