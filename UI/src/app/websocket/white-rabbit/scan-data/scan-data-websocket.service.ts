import { Injectable } from '@angular/core';
import { DbSettings } from '../../../scan-data/model/db-settings';
import { WhiteRabbitWebsocketService } from '../white-rabbit-websocket.service';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';

@Injectable()
export class ScanDataWebsocketService extends WhiteRabbitWebsocketService {

  endPoint = 'scan-data'

  constructor(whiteRabbitService: WhiteRabbitService) {
    super(whiteRabbitService)
  }

  send(data: DbSettings): void {
    this.whiteRabbitService.generateScanReportByDb(data, this.userId)
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      )
  }
}
