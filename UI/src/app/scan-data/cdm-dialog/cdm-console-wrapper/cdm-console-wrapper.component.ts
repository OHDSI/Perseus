import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperDirective } from '../../auxiliary/scan-console-wrapper/abstract-console-wrapper.directive';
import { CdmConsoleComponent } from './cdm-console/cdm-console.component';

@Component({
  selector: 'app-cdm-console-wrapper',
  templateUrl: './cdm-console-wrapper.component.html',
  styleUrls: [
    './cdm-console-wrapper.component.scss',
    '../../auxiliary/scan-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class CdmConsoleWrapperComponent extends AbstractConsoleWrapperDirective<void> {

  @Output()
  dataQualityCheck = new EventEmitter<void>();

  @ViewChild(CdmConsoleComponent)
  consoleComponent: CdmConsoleComponent;

  onDataQualityCheck() {
    this.dataQualityCheck.emit();
  }
}
