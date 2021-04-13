import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { IFrame, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { WebsocketConfig } from '../websocket.config';
import { isProd } from '../../app.constants';
import { Client } from '@stomp/stompjs/esm6/client';
import { fromPromise } from 'rxjs/internal-compatibility';
import { WhiteRabbitService } from '../../services/white-rabbit.service';
import { DbSettings } from '../../scan-data/model/db-settings';

@Injectable()
export class ScanDataWebsocketService extends WebsocketService implements OnDestroy {

  status$: Observable<boolean>;

  private stompClient: Client;

  private websocketConfig: WebsocketConfig;

  private wsSessionId: string;

  get userId() {
    return this.wsSessionId;
  }

  constructor(private whiteRabbitService: WhiteRabbitService) {
    super();
  }

  ngOnDestroy(): void {
    if (this.stompClient && this.stompClient.active) {
      this.disconnect();
    }
  }

  connect(config: WebsocketConfig): Observable<boolean> {
    this.websocketConfig = config;

    this.initStompClient();

    this.stompClient.activate();

    this.stompClient.onConnect = (frame: IFrame) => {
      this.connection$.next(frame.command === 'CONNECTED');
    };

    this.stompClient.onWebSocketClose = event => {
      if (event.code !== 1000) { // 1000 = Normal close
        fromPromise(this.stompClient.deactivate())
          .subscribe(() => this.connection$.error(event));
      }
    };

    return this.status$;
  }

  disconnect() {
    fromPromise(this.stompClient.deactivate())
      .subscribe(() => {
        this.connection$.next(false);
        this.connection$.complete();
      });
  }

  on(destination: string): Observable<string> {
    return new Observable(subscriber => {
      this.stompClient.subscribe(destination, message => {
        subscriber.next(message.body);
      });
      this.stompClient.deactivate()
        .then(() => subscriber.complete())
    });
  }

  send(destination: string, data: DbSettings): void {
    const {prefix} = this.websocketConfig;

    this.whiteRabbitService.generateScanReportByDb(data)

    this.stompClient.publish({
      destination: prefix + destination,
      body: data
    });
  }

  private initStompClient(): void {
    const {url, endPoint} = this.websocketConfig;

    this.stompClient = Stomp.over(() => {
      return new SockJS(url + endPoint);
    });

    this.stompClient.splitLargeFrames = true;

    // todo reconnect
    // this.stompClient.reconnectDelay = 1000;

    if (isProd) {
      this.stompClient.debug = msg => {};
    }
  }
}
