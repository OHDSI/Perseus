import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { authInjector } from '@services/auth/auth-injector'
import { AuthService } from '@services/auth/auth.service'
import { notExternalUrl } from '@utils/auth-util'

@Injectable()
export class UsernameInterceptor implements HttpInterceptor {

  constructor(@Inject(authInjector) private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.isUserLoggedIn && notExternalUrl(request.url)) {
      request = this.cloneWithUsernameHeader(request)
    }

    return next.handle(request)
  }

  private cloneWithUsernameHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const user = this.authService.user
    return request.clone({
      setHeaders: {
        Username: user.username
      }
    })
  }
}
