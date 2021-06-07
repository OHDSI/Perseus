import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '@popups/error-popup/error-popup.component';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

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
