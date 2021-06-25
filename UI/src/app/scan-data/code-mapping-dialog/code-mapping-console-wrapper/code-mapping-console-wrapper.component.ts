import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperDirective } from '../../auxiliary/scan-console-wrapper/abstract-console-wrapper.directive';
import { CodeMappingConsoleComponent } from './code-mapping-console/code-mapping-console.component';

@Component({
  selector: 'app-code-mapping-console-wrapper',
  templateUrl: './code-mapping-console-wrapper.component.html',
  styleUrls: [
    './code-mapping-console-wrapper.component.scss',
    '../../auxiliary/scan-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class CodeMappingConsoleWrapperComponent extends AbstractConsoleWrapperDirective<void> {

  @Output()
  completed = new EventEmitter<void>()

  @ViewChild(CodeMappingConsoleComponent)
  consoleComponent: CodeMappingConsoleComponent;

  onNext() {
    this.completed.emit()
  }
}
