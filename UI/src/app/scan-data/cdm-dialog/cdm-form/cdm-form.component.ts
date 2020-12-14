import { Component, OnInit } from '@angular/core';
import { cdmBuilderDataTypes } from '../../scan-data.constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createFakeDataForm } from '../../util/form';

@Component({
  selector: 'app-cdm-form',
  templateUrl: './cdm-form.component.html',
  styleUrls: [
    './cdm-form.component.scss',
    '../../styles/scan-data-buttons.scss',
    '../../styles/scan-data-step.scss',
    '../../styles/scan-data-form.scss',
    '../../styles/scan-data-normalize.scss',
    '../../styles/scan-data-connect-from.scss'
  ]
})
export class CdmFormComponent implements OnInit {

  sourceConnectForm: FormGroup;

  destinationConnectForm: FormGroup;

  fakeDataForm: FormGroup;

  isOriginalDatabase = true;

  sourceConnecting = false;

  destinationConnecting = false;

  sourceDataTypes = [
    'Fake Data',
    ...cdmBuilderDataTypes
  ];

  destinationDataTypes = cdmBuilderDataTypes;

  sourceDataType: string;

  destinationDataType: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const isSourceDisabled = true;
    const isDestinationDisabled = true;

    this.sourceConnectForm = this.createDbConnectForm(isSourceDisabled);
    this.destinationConnectForm = this.createDbConnectForm(isDestinationDisabled);
    this.fakeDataForm = createFakeDataForm();
  }

  private createDbConnectForm(disabled: boolean): FormGroup {
    return this.formBuilder.group({
      server: [{value: null, disabled}, [Validators.required]],
      user: [{value: null, disabled}, [Validators.required]],
      password: [{value: null, disabled}, [Validators.required]],
      database: [{value: null, disabled}, [Validators.required]],
      schemaName: [{value: null, disabled}, [Validators.required]]
    });
  }
}

