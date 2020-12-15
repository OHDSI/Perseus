import { Component } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';

@Component({
  selector: 'app-cdm-console-wrapper',
  templateUrl: './cdm-console-wrapper.component.html',
  styleUrls: [
    './cdm-console-wrapper.component.scss',
    '../../shared/scan-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class CdmConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  constructor() {
    super();
  }

  onFinish(result: string) {
  }

  onClose() {
  }
}
