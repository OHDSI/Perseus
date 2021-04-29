import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../popups/error-popup/error-popup.component';

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
