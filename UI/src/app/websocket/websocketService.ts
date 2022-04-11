import { Observable, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { parseHttpError } from '@utils/error';
import { Injectable, OnDestroy } from '@angular/core';

/**
 * @deprecated
 */
@Injectable()
export abstract class WebsocketService implements OnDestroy {

  protected status$: Observable<boolean>;

  protected connection$: Observer<boolean>;

  protected constructor() {
    this.initStatusStream();
  }

  ngOnDestroy(): void {
    if (this.connection$ && !this.connection$.closed) {
      this.disconnect()
    }
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
      catchError(error => {
        this.disconnect()
        throw error
      })
    );
  }
}
