import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '@popups/error-popup/error-popup.component';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http'
import { blobToObj } from './blob-util';

export function parseHttpError(error) {
  if (typeof error === 'string') {
    return error;
  } else if (error.error?.message) {
    return error.error.message;
  } else if (error.message) {
    return error.message;
  } else if (error.error) {
    return parseHttpError(error.error)
  } else if (error.statusText) {
    return error.statusText;
  } else {
    return null;
  }
}

export function openErrorDialog(dialogService: MatDialog, title: string, message: string, panelClass = 'perseus-dialog') {
  dialogService.open(ErrorPopupComponent, {
    panelClass,
    data: {
      title,
      message
    }
  })
}

/**
 * Call this method in switchMap as disposable stream
 */
function catchErrorAndContinue$<T>(stream$: Observable<T>,
                                   errorHandler: (error) => void = () => {},
                                   defaultValue: T = null) {
  return stream$.pipe(
    catchError(error => {
      errorHandler(error)
      return of(defaultValue)
    })
  )
}

export function switchMapCatchErrorAndContinue<S, R>(result$: (source: S) => Observable<R>,
                                                     errorHandler: (error) => void = () => {},
                                                     defaultValue: R = null): (source$: Observable<S>) => Observable<R> {
  return source$ => source$.pipe(
    switchMap(source =>
      catchErrorAndContinue$<R>(result$(source), errorHandler, defaultValue)
    )
  )
}

export function parseBlobErrorResponse<T>(httpErrorResponse: HttpErrorResponse): Observable<T> {
  const blobBody = httpErrorResponse.error as Blob;
  return new Observable<T>(subscriber => {
    blobToObj<T>(blobBody)
      .then(objBody => {
        subscriber.error(objBody);
        subscriber.complete();
      })
      .catch(error => {
        subscriber.error(error);
        subscriber.complete();
      });
  });
}

export function fromBlobError<T>(): (source$: Observable<T>) => Observable<T> {
  return source$ => source$.pipe(
    catchError(
    error => parseBlobErrorResponse<T>(error)
    )
  );
}
