import { Observable, Observer } from 'rxjs';
import { WebsocketConfig } from './websocket.config';
import { distinctUntilChanged, share } from 'rxjs/operators';

export abstract class WebsocketService {
  status$: Observable<boolean>;

  protected connection$: Observer<boolean>;

  protected constructor() {
    this.initStatusStream();
  }

  abstract connect(config: WebsocketConfig): Observable<boolean>;

  abstract on(destination: string): Observable<string | any>;

  abstract send(destination: string, data: string | any): void;

  abstract disconnect(): void;

  private initStatusStream(): void {
    this.status$ = new Observable<boolean>(
      observer => this.connection$ = observer
    ).pipe(
      share(),
      distinctUntilChanged()
    );
  }
}
