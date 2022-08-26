import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { authInjector } from '@services/auth/auth-injector'
import { AuthService } from '@services/auth/auth.service'
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators'
import { Router } from '@angular/router'
import { loginRouter } from '@app/app.constants'
import { notExternalUrl } from '@utils/auth-util'

enum RefreshStatus {
  IN_PROGRESS,
  COMPLETED,
  FAILED
}

@Injectable()
export class AzureInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private refreshToken$ = new ReplaySubject<RefreshStatus>(1);

  constructor(@Inject(authInjector) private authService: AuthService,
              private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 && this.authService.isUserLoggedIn && notExternalUrl(request.url)) {
          return this.handle401Error(request, next)
        }
        throw error
      })
    )
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshToken$
        .pipe(
          filter(status => status !== RefreshStatus.IN_PROGRESS),
          take(1),
          switchMap(status => {
            if (status === RefreshStatus.COMPLETED) {
              return next.handle(request)
            } else {
              throw new Error('Auth failed')
            }
          })
        )
    } else {
      this.isRefreshing = true
      this.refreshToken$.next(RefreshStatus.IN_PROGRESS)
      return this.authService.refreshToken()
        .pipe(
          catchError(error => {
            this.refreshToken$.next(RefreshStatus.FAILED)
            this.router.navigateByUrl(loginRouter)
            throw error
          }),
          switchMap(() => {
            this.refreshToken$.next(RefreshStatus.COMPLETED)
            return next.handle(request)
          }),
          finalize(() => this.isRefreshing = false)
        )
    }
  }
}
