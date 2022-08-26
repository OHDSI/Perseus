import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { authInjector } from '@services/auth/auth-injector'
import { AuthService } from '@services/auth/auth.service'
import { catchError, switchMap } from 'rxjs/operators'
import { Router } from '@angular/router'
import { loginRouter } from '@app/app.constants'

@Injectable()
export class AddInterceptor implements HttpInterceptor {

  constructor(@Inject(authInjector) private authService: AuthService,
              private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 && this.authService.isUserLoggedIn) {
          return this.handle401Error(request, next, error)
        }
        throw error
      })
    )
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler, error: unknown): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(res => {
        if (res) {
          return next.handle(request)
        }
        throw error
      }),
      catchError(e => {
        this.router.navigate([loginRouter])
        throw e
      })
    )
  }
}
