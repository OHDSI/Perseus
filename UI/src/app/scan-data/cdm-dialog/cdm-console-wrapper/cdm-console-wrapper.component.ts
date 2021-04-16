import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { CdmConsoleComponent } from './cdm-console/cdm-console.component';

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

  @Output()
  dataQualityCheck = new EventEmitter<void>();

  @ViewChild(CdmConsoleComponent)
  scanDataConsoleComponent: CdmConsoleComponent;

  onFinish(result: string) {
    this.result = result;
  }

  onClose() {
    this.close.emit();
  }

  onDataQualityCheck() {
    this.dataQualityCheck.emit();
  }
}
