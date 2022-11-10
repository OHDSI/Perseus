import { BaseComponent } from '@shared/base/base.component'
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { Conversion } from '@models/conversion/conversion'
import { Observable, Subscription, timer } from 'rxjs'
import { exhaustMap, takeUntil } from 'rxjs/operators'
import { ConversionStatus } from '@models/conversion/conversion-status'
import { ProgressLog } from '@models/progress-console/progress-log'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'
import { parseHttpError } from '@utils/error'

@Component({
  template: ``
})
export abstract class ProgressConsoleWrapperComponent extends BaseComponent implements OnInit {
  readonly CONVERSION_INFO_REQUEST_INTERVAL: number = 5000

  @Input()
  conversion: Conversion
  private conversionSub: Subscription

  @Output()
  back = new EventEmitter<void>()

  @Output()
  close = new EventEmitter<Conversion>()

  @ViewChild(ProgressConsoleComponent)
  consoleComponent: ProgressConsoleComponent

  get logs(): ProgressLog[] {
    return this.conversion.logs ?? []
  }

  abstract conversionInfoRequest(): Observable<Conversion>

  abstract onAbortAndCancel(): void

  ngOnInit(): void {
    this.conversionSub = timer(0, this.CONVERSION_INFO_REQUEST_INTERVAL)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        exhaustMap(() => this.conversionInfoRequest())
      )
      .subscribe(conversion => {
        conversion.dataConnection = this.conversion.dataConnection
        this.conversion = conversion
        if (this.conversion.statusCode !== ConversionStatus.IN_PROGRESS) {
          this.conversionSub.unsubscribe()
          if (this.conversion.statusCode === ConversionStatus.FAILED) {
            this.consoleComponent.changeProgressColorToError()
          }
        }
      }, error => {
        this.conversionSub.unsubscribe()
        this.conversion.statusCode = ConversionStatus.FAILED
        this.consoleComponent.addErrorLog(parseHttpError(error))
        this.consoleComponent.changeProgressColorToError();
      })
  }

  onBack(): void {
    this.back.emit()
  }

  onClose(): void {
    this.close.emit(this.conversion)
  }
}
