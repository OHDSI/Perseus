import { WebsocketService } from '../websocket.service';
import { Observable } from 'rxjs/internal/Observable';
import { DqdService } from '@services/data-quality-check/dqd.service';
import { dqdWsUrl } from '@app/app.constants';
import { DbSettings } from '@models/scan-data/db-settings';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class DqdWebsocketService extends WebsocketService implements OnDestroy {

  private socket: WebSocket;

  private wsSessionId: string;

  get userId() {
    return this.wsSessionId;
  }

  constructor(private dqdService: DqdService) {
    super();
  }

  ngOnDestroy() {
    if (this.socket.readyState < WebSocket.CLOSING) {
      this.socket.close()
    }
  }

  connect(): Observable<boolean> {
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

  on(): Observable<any> {
    return new Observable<string>(subscriber => {
      this.socket.onmessage = event => {
        subscriber.next(event.data);
      };
    });
  }

  send(data: DbSettings): void {
    this.dqdService.dataQualityCheck(data, this.userId)
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      );
  }
}
