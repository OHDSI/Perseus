import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { authInjector } from '@services/auth/auth-injector';
import { AuthService } from '@services/auth/auth.service';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { isDev, loginRouter } from '../app.constants';
import { Router } from '@angular/router';
import { notExternalUrl } from '@utils/auth-util'
import { User } from '@models/auth/user'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private refreshToken$ = new BehaviorSubject<string>(null);

  constructor(@Inject(authInjector) private authService: AuthService,
              private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isUserLoggedIn && notExternalUrl(request.url)) {
      request = this.cloneWithAuthorizationHeader(request)
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

  private cloneWithAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    const user = this.authService.user
    const headers = isDev ? {Authorization: user.token, Username: user.username} : {Authorization: user.token}
    return request.clone({
      setHeaders: headers
    })
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshToken$
        .pipe(
          filter(token => token !== null),
          take(1),
          switchMap(() => next.handle(this.cloneWithAuthorizationHeader(request)))
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
          switchMap((user: User) => {
            this.refreshToken$.next(user.refresh_token)
            return next.handle(this.cloneWithAuthorizationHeader(request))
          }),
          finalize(() => this.isRefreshing = false)
        )
    }
  }
}
