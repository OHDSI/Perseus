import { Component, Input, OnInit } from '@angular/core';
import { ScanDataService } from '@services/white-rabbit/scan-data.service';
import { ProgressConsoleComponent } from '@scan-data/auxiliary/progress-console/progress-console.component'
import { Observable } from 'rxjs';
import { Conversion } from '@models/conversion/conversion'
import { ProgressLog } from '@models/progress-console/progress-log'

@Component({
  selector: 'scan-data-console',
  templateUrl: '../../../auxiliary/progress-console/progress-console.component.html',
  styleUrls: ['../../../auxiliary/progress-console/progress-console.component.scss']
})
export class ScanDataConsoleComponent extends ProgressConsoleComponent implements OnInit {
  @Input()
  conversion!: Conversion

  constructor(private whiteRabbitService: ScanDataService) {
    super()
  }

  logsRequest(): Observable<ProgressLog[]> {
    return this.whiteRabbitService.logs(this.conversion.id);
  }
}
