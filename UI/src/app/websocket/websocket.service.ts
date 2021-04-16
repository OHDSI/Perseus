import { Observable, Observer } from 'rxjs';
import { catchError, distinctUntilChanged, share } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { parseHttpError } from '../services/utilites/error';

export abstract class WebsocketService {
  status$: Observable<boolean>;

  protected connection$: Observer<boolean>;

  protected constructor() {
    this.initStatusStream();
  }

  handleError(error: any): string {
    if (error instanceof HttpErrorResponse) {
      return `Error: ${parseHttpError(error)}`
    }
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
      distinctUntilChanged(),
      catchError(error => {
        this.disconnect()
        throw error
      })
    );
  }
}
