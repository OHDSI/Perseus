import { Observable, Observer } from 'rxjs';
import { distinctUntilChanged, share } from 'rxjs/operators';

export abstract class WebsocketService {
  status$: Observable<boolean>;

  protected connection$: Observer<boolean>;

  protected constructor() {
    this.initStatusStream();
  }

  handleError(error: any): string {
    return `Error: ${error.reason ? error.reason : error.message}`
  }

  abstract connect(): Observable<boolean>;

  abstract on(): Observable<string | any>;

  abstract send(data: string | any): void;

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
