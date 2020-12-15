import { Observable } from 'rxjs';
import { WebsocketConfig } from './websocket.config';

export abstract class WebsocketService {
  status$: Observable<boolean>;

  abstract connect(config: WebsocketConfig): Observable<boolean>;

  abstract on(destination: string): Observable<string>;

  abstract send(destination: string, data: string): void;

  abstract disconnect(): void;
}
