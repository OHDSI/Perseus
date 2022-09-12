import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProgressConsoleWrapperComponent } from '@scan-data/auxiliary/progress-console-wrapper/progress-console-wrapper.component'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'
import { Conversion } from '@models/conversion/conversion'
import { Observable } from 'rxjs'
import { ImportCodesService } from '@services/usagi/import-codes.service'

@Component({
  selector: 'app-code-mapping-console-wrapper',
  templateUrl: './code-mapping-console-wrapper.component.html',
  styleUrls: [
    './code-mapping-console-wrapper.component.scss',
    '../../auxiliary/progress-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class CodeMappingConsoleWrapperComponent extends ProgressConsoleWrapperComponent {

  @Input()
  conversion: Conversion

  @Output()
  completed = new EventEmitter<void>()

  @ViewChild(ProgressConsoleComponent)
  consoleComponent: ProgressConsoleComponent;

  constructor(private usagiService: ImportCodesService) {
    super()
  }

  conversionInfoRequest(): Observable<Conversion> {
    return this.usagiService.calculatingScoresInfoWithLogs(this.conversion.id)
  }

  onAbortAndCancel() {
    return this.usagiService.cancelCalculateScoresByCsvCodes()
      .subscribe(() => this.onClose())
  }

  onNext() {
    this.completed.emit()
  }
}
