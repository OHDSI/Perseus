import { BaseComponent } from '@shared/base/base.component'
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Conversion } from '@models/conversion/conversion'
import { interval, Observable, Subscription } from 'rxjs'
import { exhaustMap, takeUntil } from 'rxjs/operators'
import { ConversionStatus } from '@models/conversion/conversion-status'

@Component({
  template: ``
})
export abstract class ProgressConsoleWrapperComponent extends BaseComponent implements OnInit {
  public static CONVERSION_INFO_REQUEST_INTERVAL = 3000

  @Input()
  conversion: Conversion
  private conversionSub: Subscription

  @Output()
  back = new EventEmitter<void>()

  @Output()
  close = new EventEmitter<Conversion>()

  abstract consoleComponent: ProgressConsoleComponent

  abstract conversionInfoRequest(): Observable<Conversion>

  ngOnInit(): void {
    this.conversionSub = interval(ProgressConsoleWrapperComponent.CONVERSION_INFO_REQUEST_INTERVAL)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        exhaustMap(() => this.conversionInfoRequest())
      )
      .subscribe(conversion => {
        this.conversion = conversion
        if (this.conversion.statusCode !== ConversionStatus.IN_PROGRESS) {
          this.conversionSub.unsubscribe()
          setTimeout(() => {
            this.consoleComponent.stopLogging(this.conversion)
          }, ProgressConsoleComponent.LOGS_REQUEST_INTERVAL + 100)
        }
      })
  }
}
