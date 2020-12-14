import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cdm-connect-form',
  templateUrl: './cdm-connect-form.component.html',
  styleUrls: [
    '../cdm-form.component.scss',
    '../../../styles/scan-data-form.scss',
    '../../../styles/scan-data-connect-from.scss'
  ]
})
export class CdmConnectFormComponent {

  @Input()
  form: FormGroup;

}
