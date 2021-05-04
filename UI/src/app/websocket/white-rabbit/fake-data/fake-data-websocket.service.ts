import { Injectable } from '@angular/core';
import { WhiteRabbitWebsocketService } from '../white-rabbit-websocket.service';
import { FakeDataParams } from '../../../models/scan-data/fake-data-params';
import { FakeDataService } from '../../../services/white-rabbit/fake-data.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class FakeDataWebsocketService extends WhiteRabbitWebsocketService {

  endPoint = 'fake-data'

  constructor(private fakeDataService: FakeDataService) {
    super()
  }

  send(data: {params: FakeDataParams, report: File}): void {
    const {params, report} = data
    this.fakeDataService.getUserSchema()
      .pipe(
        switchMap(schema =>
          this.fakeDataService.generateFakeData({
            ...params, dbSettings: {
              ...params.dbSettings,
              schema
            }
          }, this.userId, report)
        )
      )
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      )
  }
}
