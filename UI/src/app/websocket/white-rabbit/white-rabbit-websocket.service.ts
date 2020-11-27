import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Observer} from 'rxjs';
import { WebsocketService } from '../webscoket.service';
import { distinctUntilChanged, share } from 'rxjs/operators';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { CompatClient } from '@stomp/stompjs/esm6/compatibility/compat-client';
import { WebsocketModule } from '../websocket.module';
import { WebsocketConfig } from '../websocket.config';

@Injectable({
  providedIn: WebsocketModule
})
export class WhiteRabbitWebsocketService implements WebsocketService, OnDestroy {

  status$: Observable<boolean>;

  private connection$: Observer<boolean>;

  private stompClient: CompatClient;

  private websocketConfig: WebsocketConfig;

  constructor() {
    this.initStatusStream();
  }

  ngOnDestroy(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.disconnect();
    }

    if (this.connection$ && !this.connection$.closed) {
      this.connection$.complete();
    }
  }

  connect(config: WebsocketConfig): Observable<boolean> {
    this.websocketConfig = config;
    this.initStompClient();

    this.stompClient.connect({}, frame => {
      this.connection$.next(true);
    }, error => {
      this.connection$.next(false);
    });

    return this.status$;
  }

  disconnect() {
    this.stompClient.disconnect();
    this.connection$.next(false);
    this.connection$.complete();
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
    this.stompClient.send(prefix + destination, {}, data);
  }

  private initStompClient(): void {
    const {url, prefix, endPoint} = this.websocketConfig;
    const socket = new SockJS(url + prefix + endPoint);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = msg => {
    };
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
