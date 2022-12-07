import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NewScanRequest } from '../api/models';
import { ScanRequestControllerService, ScanRequestLogControllerService } from '../api/services';
import { LoopbackDataConnectionSettingsComponent } from '../data-connection-settings.component';
import { DataConnectionService } from '../data-connection.service';

@Component({
  templateUrl: './databricks-settings.component.html',
  styleUrls: [
    '../../scan-data/scan-data-dialog/scan-data-form/connect-form/connect-form.component.scss',
    '../../scan-data/styles/scan-data-form.scss',
    '../../scan-data/styles/scan-data-connect-form.scss'
  ]
})
export class DatabricksSettingsComponent implements LoopbackDataConnectionSettingsComponent {

  form: FormGroup

  public constructor(
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      host: [{value: null, disabled: false}, [Validators.required]],
      port: [{value: 443, disabled: false}, [Validators.required]],
      protocol: [{value: 'https', disabled: false}, [Validators.required]],
      path: [{value: null, disabled: false}, [Validators.required]],
      token: [{value: null, disabled: false}, []],
    });
  }

  reset(): void {
    this.form.reset()
  }

  get valueChanges(): Observable<any> {
    return this.form.valueChanges
  }

  get valid(): boolean {
    return this.form.valid
  }

  disable(): void {
    this.form.disable()
  }

  enable(): void {
    this.form.enable({emitEvent: false})
  }

  submit(): NewScanRequest['dataSourceConfig'] {
    const d: NewScanRequest['dataSourceConfig'] = {
      connector: 'databricks',
      host: this.form.value.host,
      path: this.form.value.path,
    }
    if (this.form.value.token) {
      d.token = this.form.value.token
    }
    return d
  }

}
