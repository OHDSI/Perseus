import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { authInjector } from './auth-injector';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { loginRouter } from '../../app.constants';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

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
    const {email, refresh_token} = this.authService.user
    return this.authService.refreshToken(email, refresh_token)
      .pipe(
        switchMap(() => next.handle(this.addAuthorizationHeader(request))),
        catchError(error => {
          this.router.navigateByUrl(loginRouter)
          throw error
        })
      )
  }
}
