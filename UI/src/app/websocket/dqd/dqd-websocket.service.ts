import { WebsocketService } from '../websocket.service';
import { WebsocketConfig } from '../websocket.config';
import { Observable } from 'rxjs/internal/Observable';
import { DqdService } from '../../services/dqd.service';
import { dqdWsUrl } from '../../app.constants';
import { DbSettings } from '../../scan-data/model/db-settings';
import { Injectable } from '@angular/core';

@Injectable()
export class DqdWebsocketService extends WebsocketService {

  private socket: WebSocket;

  private wsSessionId: string;

  get userId() {
    return this.wsSessionId;
  }

  constructor(private dqdService: DqdService) {
    super();
  }

  connect(config: WebsocketConfig): Observable<boolean> {
    this.socket = new WebSocket(dqdWsUrl);

    this.socket.onerror = error => {
      this.connection$.error(error);
    };

    this.socket.onclose = () => {
      this.connection$.complete();
    };

    this.socket.onmessage = event => {
      this.wsSessionId = event.data;
      this.connection$.next(true);
    };

    return this.status$;
  }

  disconnect(): void {
    this.socket.onclose = () => {};
    this.socket.close();

    this.dqdService.cancel(this.userId)
      .subscribe(() => {
        this.connection$.next(false);
        this.connection$.complete();
      }, error => this.connection$.error(error));
  }

  on(destination: string): Observable<any> {
    return new Observable<string>(subscriber => {
      this.socket.onmessage = event => {
        subscriber.next(event.data);
      };
    });
  }

  send(destination: string, data: DbSettings): void {
    this.dqdService.dataQualityCheck(data, this.userId)
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      );
  }
}
