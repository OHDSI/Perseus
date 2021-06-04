import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { IFrame, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { isProd, whiteRabbitWsUrl } from '../../app.constants';
import { Client } from '@stomp/stompjs/esm6/client';
import { fromPromise } from 'rxjs/internal-compatibility';

export abstract class WhiteRabbitWebsocketService extends WebsocketService implements OnDestroy {

  protected abstract endPoint: string

  private socket: SockJS;

  private stompClient: Client;

  private wsSessionId: string;

  protected constructor() {
    super()
  }

  /* Return WebSocket connection session id */
  get userId() {
    return this.wsSessionId;
  }

  ngOnDestroy() {
    if (this.stompClient.active) {
      this.disconnect()
    }
  }

  connect(): Observable<boolean> {
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
      } else {
        this.connection$.complete()
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

  on(): Observable<string> {
    return new Observable(subscriber => {
      this.stompClient.subscribe('/user/queue/reply', message => {
        subscriber.next(message.body);
      });
    });
  }

  private initStompClient(): void {
    this.stompClient = Stomp.over(() => {
      this.socket = new SockJS(`${whiteRabbitWsUrl}/${this.endPoint}`);
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
    if (match?.length === 0) {
      throw Error('Could not get WhiteRabbit session id')
    }
    return match[0].replace('/websocket', '')
  }
}
