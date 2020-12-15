import { Injectable } from '@angular/core';
import { WebsocketService } from '../webscoket.service';
import { Observable } from 'rxjs/internal/Observable';
import { WebsocketConfig } from '../websocket.config';

@Injectable({
  providedIn: 'root'
})
export class CdmBuilderWebsocketService implements WebsocketService {

  status$: Observable<boolean>;

  constructor() { }

  connect(config: WebsocketConfig): Observable<boolean> {
    return undefined;
  }

  on(destination: string): Observable<string> {
    return undefined;
  }

  send(destination: string, data: string): void {
  }

  disconnect(): void {
  }
}
