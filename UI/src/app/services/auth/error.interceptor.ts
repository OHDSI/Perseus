import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { authInjector } from './auth-injector';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(@Inject(authInjector) private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            this.authService.logout()
            // todo redirect
          }

          return throwError(error)
        })
      )
  }
}
