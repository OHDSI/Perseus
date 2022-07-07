import { Component, Input, ViewChild } from '@angular/core';
import { ProgressConsoleWrapperComponent } from '@scan-data/auxiliary/progress-console-wrapper/progress-console-wrapper.component'
import { Observable } from 'rxjs'
import { Conversion } from '@models/conversion/conversion'
import { FakeDataService } from '@services/white-rabbit/fake-data.service'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'

@Component({
  selector: 'app-fake-data-console-wrapper',
  templateUrl: './fake-console-wrapper.component.html',
  styleUrls: ['fake-console-wrapper.component.scss', '../../auxiliary/progress-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class FakeConsoleWrapperComponent extends ProgressConsoleWrapperComponent {
  @Input()
  conversion: Conversion

  @ViewChild(ProgressConsoleComponent)
  consoleComponent: ProgressConsoleComponent

  constructor(private fakeDataService: FakeDataService) {
    super()
  }

  conversionInfoRequest(): Observable<Conversion> {
    return this.fakeDataService.conversionInfoWithLogs(this.conversion.id)
  }

  onAbortAndCancel(): void {
    this.fakeDataService.abort(this.conversion.id)
      .subscribe(() => this.back.emit())
  }
}
