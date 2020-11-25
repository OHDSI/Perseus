import { Observable } from 'rxjs';

export interface WebsocketService {
  status$: Observable<boolean>;

  on(destination: string): Observable<string>;

  send(destination: string, data: string): void;
}
