import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataConnectionSettingsComponent } from '../data-connection-settings.component';

@Component({
  templateUrl: './databricks-settings.component.html',
  styleUrls: [
    '../../../scan-data/scan-data-dialog/scan-data-form/connect-form/connect-form.component.scss',
    '../../styles/scan-data-form.scss',
    '../../styles/scan-data-connect-form.scss'
  ]
})
export class DatabricksSettingsComponent implements DataConnectionSettingsComponent {

  form: FormGroup

  public constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      server: [{value: null, disabled: false}, [Validators.required]],
      port: [{value: 443, disabled: false}, [Validators.required]],
      protocol: [{value: 'https', disabled: false}, [Validators.required]],
      path: [{value: null, disabled: false}, [Validators.required]],
      token: [{value: null, disabled: false}, []],
    });
  }
}
