import { Injectable } from '@angular/core';
import { WhiteRabbitWebsocketService } from '../white-rabbit-websocket.service';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';
import { FakeDataParams } from '../../../scan-data/model/fake-data-params';

@Injectable()
export class FakeDataWebsocketService extends WhiteRabbitWebsocketService {

  endPoint = 'fake-data'

  constructor(whiteRabbitService: WhiteRabbitService) {
    super(whiteRabbitService)
  }

  send(data: {params: FakeDataParams, report: File}): void {
    const {params, report} = data
    this.whiteRabbitService.generateFakeData(params, this.userId, report)
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      )
  }
}
