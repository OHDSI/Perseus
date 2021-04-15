import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { IFrame, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { WebsocketConfig } from '../websocket.config';
import { isProd, whiteRabbitWsUrl } from '../../app.constants';
import { Client } from '@stomp/stompjs/esm6/client';
import { fromPromise } from 'rxjs/internal-compatibility';
import { WhiteRabbitService } from '../../services/white-rabbit.service';
import { DbSettings } from '../../scan-data/model/db-settings';
import { generateSessionId } from '../session';

@Injectable()
export class ScanDataWebsocketService extends WebsocketService implements OnDestroy {

  status$: Observable<boolean>;

  private socket: SockJS;

  private stompClient: Client;

  private websocketConfig: WebsocketConfig;

  private wsSessionId: string;

  get userId() {
    return this.wsSessionId;
  }

  constructor(private whiteRabbitService: WhiteRabbitService) {
    super()
  }

  ngOnDestroy(): void {
    if (this.stompClient?.active) {
      this.disconnect();
    }
  }

  connect(config: WebsocketConfig): Observable<boolean> {
    this.websocketConfig = config;
    this.initStompClient();
    this.stompClient.activate();

    this.stompClient.onConnect = (frame: IFrame) => {
      this.wsSessionId = this.sessionId()
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
    this.whiteRabbitService.generateScanReportByDb(data, this.userId)
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      )
  }

  private initStompClient(): void {
    this.stompClient = Stomp.over(() => {
      this.socket = new SockJS(`${whiteRabbitWsUrl}/queue`);
      return this.socket;
    });

    this.stompClient.splitLargeFrames = true; // Need to send large messages
    // todo reconnect
    // this.stompClient.reconnectDelay = 1000;
    if (isProd) { // Disable logging
      this.stompClient.debug = msg => {};
    }
  }

  private sessionId(): string {
    const sessionRegex = new RegExp(/(\w|\d)+\/websocket/)
    const match = this.socket._transport.url.match(sessionRegex);
    return match.length > 0 && !!match[0] ?
      match[0].replace('/websocket', '') :
      generateSessionId();
  }
}
