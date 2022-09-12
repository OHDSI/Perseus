import { Inject, Injectable, Optional } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { authInjector } from '@services/auth/auth-injector'
import { AuthService } from '@services/auth/auth.service'
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators'
import { Router } from '@angular/router'
import { loginRouter } from '@app/app.constants'
import { OAuthModuleConfig, OAuthStorage } from 'angular-oauth2-oidc'

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
              private router: Router,
              private authStorage: OAuthStorage,
              @Optional() private moduleConfig: OAuthModuleConfig) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.needIntercept(request.url)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 && this.authService.isUserLoggedIn) {
          return this.handle401Error(request, next, error)
        }
        throw error
      })
    )
  }

  private handle401Error(request: HttpRequest<unknown>,
                         next: HttpHandler,
                         error401: HttpResponse<unknown>): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      return this.refreshToken$
        .pipe(
          filter(status => status !== RefreshStatus.IN_PROGRESS),
          take(1),
          switchMap(status => {
            if (status === RefreshStatus.COMPLETED) {
              return next.handle(this.cloneWithAuthorizationHeader(request))
            } else {
              throw error401
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
            return next.handle(this.cloneWithAuthorizationHeader(request))
          }),
          finalize(() => this.isRefreshing = false)
        )
    }
  }

  private cloneWithAuthorizationHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.authStorage.getItem('access_token');
    const header = 'Bearer ' + token;
    const headers = request.headers.set('Authorization', header);

    return request.clone({ headers });
  }

  private needIntercept(reqUrl: string): boolean {
    if (!this.moduleConfig?.resourceServer?.sendAccessToken) {
      return false
    }
    if (this.moduleConfig.resourceServer.allowedUrls) {
      return !!this.moduleConfig.resourceServer.allowedUrls
        .find(url =>
          reqUrl.toLowerCase().startsWith(url.toLowerCase())
        )
    }
    return true
  }
}
