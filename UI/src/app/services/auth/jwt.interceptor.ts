import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { authInjector } from './auth-injector';
import { AuthService } from './auth.service';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { loginRouter } from '../../app.constants';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private refreshToken$ = new BehaviorSubject<string>(null);

  constructor(@Inject(authInjector) private authService: AuthService,
              private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isUserLoggedIn) {
      request = this.addAuthorizationHeader(request)
    }

    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error.status === 401 && this.authService.isUserLoggedIn) {
            return this.handle401Error(request, next)
          }

          return throwError(error)
        })
      )
  }

  private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: this.authService.user.token
      }
    })
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshToken$
        .pipe(
          filter(token => token !== null),
          take(1),
          switchMap(() => next.handle(this.addAuthorizationHeader(request)))
        )
    } else {
      this.isRefreshing = true;
      this.refreshToken$.next(null);

      const {email, refresh_token} = this.authService.user
      return this.authService.refreshToken(email, refresh_token)
        .pipe(
          catchError(error => {
            this.refreshToken$.error(error)
            this.router.navigateByUrl(loginRouter)
            throw error
          }),
          switchMap(user => {
            this.refreshToken$.next(user.refresh_token)
            return next.handle(this.addAuthorizationHeader(request))
          }),
          finalize(() => this.isRefreshing = false)
        )
    }
  }
}
