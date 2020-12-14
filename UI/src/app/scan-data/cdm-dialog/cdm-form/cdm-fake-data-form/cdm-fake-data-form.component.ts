import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cdm-fake-data-form',
  templateUrl: './cdm-fake-data-form.component.html',
  styleUrls: [
    'cdm-fake-data-form.component.scss',
    '../cdm-form.component.scss',
    '../../../styles/scan-data-form.scss',
    '../../../styles/scan-data-connect-from.scss'
  ]
})
export class CdmFakeDataFormComponent {

  @Input()
  form: FormGroup;

  checkboxBackground = '#F9F9F9';
}
