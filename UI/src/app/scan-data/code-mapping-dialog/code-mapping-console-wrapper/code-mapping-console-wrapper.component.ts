import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../auxiliary/scan-console-wrapper/abstract-console-wrapper.component';
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
export class CodeMappingConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  @Output()
  completed = new EventEmitter<void>()

  @ViewChild(CodeMappingConsoleComponent)
  scanDataConsoleComponent: CodeMappingConsoleComponent;

  error: string

  onNext() {
    this.completed.emit()
  }

  onBack() {
    this.close.emit();
  }

  onFinish(result: boolean) {
    this.result = result
  }

  onError(error: string) {
    this.error = error
  }
}
