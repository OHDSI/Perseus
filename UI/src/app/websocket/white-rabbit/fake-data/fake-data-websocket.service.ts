import { Injectable } from '@angular/core';
import { WhiteRabbitWebsocketService } from '../white-rabbit-websocket.service';
import { FakeDataParams } from '../../../scan-data/model/fake-data-params';
import { FakeDataService } from '../../../services/white-rabbit/fake-data.service';

@Injectable()
export class FakeDataWebsocketService extends WhiteRabbitWebsocketService {

  endPoint = 'fake-data'

  constructor(private fakeDataService: FakeDataService) {
    super()
  }

  send(data: {params: FakeDataParams, report: File}): void {
    const {params, report} = data
    this.fakeDataService.generateFakeData(params, this.userId, report)
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      )
  }
}
