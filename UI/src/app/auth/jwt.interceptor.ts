import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { authInjector } from './auth-injector';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(@Inject(authInjector) private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {token} = this.authService.user

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: token
        }
      })
    }

    return next.handle(request)
  }
}
