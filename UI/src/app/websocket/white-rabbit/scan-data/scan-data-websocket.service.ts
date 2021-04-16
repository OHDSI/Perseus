import { Injectable } from '@angular/core';
import { DbSettings } from '../../../scan-data/model/db-settings';
import { WhiteRabbitWebsocketService } from '../white-rabbit-websocket.service';
import { ScanDataService } from '../../../services/white-rabbit/scan-data.service';
import { DelimitedTextFileSettings } from '../../../scan-data/model/delimited-text-file-settings';

@Injectable()
export class ScanDataWebsocketService extends WhiteRabbitWebsocketService {

  endPoint = 'scan-data'

  constructor(private scanDataService: ScanDataService) {
    super()
  }

  send(data: DbSettings | DelimitedTextFileSettings): void {
    const request$ = 'dbType' in data ?
      this.scanDataService.generateScanReportByDb(data, this.userId) :
      this.scanDataService.generateScanReportByFiles(data as DelimitedTextFileSettings, this.userId)

    request$.subscribe(
      () => this.connection$.next(true),
      error => this.connection$.error(error)
    )
  }
}
