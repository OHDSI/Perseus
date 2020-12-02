import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Observer} from 'rxjs';
import { WebsocketService } from '../webscoket.service';
import { distinctUntilChanged, share } from 'rxjs/operators';
import { IFrame, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { WebsocketModule } from '../websocket.module';
import { WebsocketConfig } from '../websocket.config';
import { isProd } from '../../app.constants';
import { Client } from '@stomp/stompjs/esm6/client';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: WebsocketModule
})
export class WhiteRabbitWebsocketService implements WebsocketService, OnDestroy {

  status$: Observable<boolean>;

  private connection$: Observer<boolean>;

  private stompClient: Client;

  private websocketConfig: WebsocketConfig;

  constructor() {
    this.initStatusStream();
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
    });
  }

  send(destination: string, data: string): void {
    const {prefix} = this.websocketConfig;

    this.stompClient.publish({
      destination: prefix + destination,
      body: data
    });
  }

  private initStompClient(): void {
    const {url, prefix, endPoint} = this.websocketConfig;

    this.stompClient = Stomp.over(() => {
      return new SockJS(url + prefix + endPoint);
    });

    this.stompClient.splitLargeFrames = true;

    // todo reconnect
    // this.stompClient.reconnectDelay = 1000;

    if (isProd) {
      this.stompClient.debug = msg => {};
    }
  }

  private initStatusStream(): void {
    this.status$ = new Observable<boolean>(
      observer => this.connection$ = observer
    ).pipe(
      share(),
      distinctUntilChanged()
    );
  }
}
