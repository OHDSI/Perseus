import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Conversion } from '@models/conversion/conversion'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'
import { ProgressConsoleWrapperComponent } from '@scan-data/auxiliary/progress-console-wrapper/progress-console-wrapper.component'
import { Observable } from 'rxjs'
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service'
import { MatDialog } from '@angular/material/dialog'
import { openErrorDialog, parseHttpError } from '@utils/error'
import { CdmButtonsStateService } from '@services/cdm-builder/cdm-buttons-state.service'

@Component({
  selector: 'app-cdm-console-wrapper',
  templateUrl: './cdm-console-wrapper.component.html',
  styleUrls: [
    './cdm-console-wrapper.component.scss',
    '../../auxiliary/progress-console-wrapper/console-wrapper.component.scss',
    '../../styles/scan-data-buttons.scss'
  ]
})
export class CdmConsoleWrapperComponent extends ProgressConsoleWrapperComponent {
  @Input()
  conversion: Conversion

  @ViewChild(ProgressConsoleComponent)
  consoleComponent: ProgressConsoleComponent

  @Output()
  dataQualityCheck = new EventEmitter<void>()

  constructor(private cdbBuilderService: CdmBuilderService,
              private dialogService: MatDialog,
              public cdmButtonsService: CdmButtonsStateService) {
    super()
  }

  conversionInfoRequest(): Observable<Conversion> {
    return this.cdbBuilderService.conversionInfoWithLog(this.conversion.id);
  }

  onAbortAndCancel(): void {
    this.cdbBuilderService.abort(this.conversion.id)
      .subscribe(
        () => this.onBack(),
        error => {
          openErrorDialog(this.dialogService, 'Abort convert to CDM', parseHttpError(error))
          this.onBack()
        }
      )
  }

  onDataQualityCheck() {
    this.dataQualityCheck.emit()
  }
}
