import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { authInjector } from '@services/auth/auth-injector';
import { loginRouter } from '@app/app.constants';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { withLoading } from '@utils/loading';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

  loading = false

  constructor(private router: Router,
              @Inject(authInjector) private authService: AuthService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.canLoadOrActivate()
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canLoadOrActivate()
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canLoadOrActivate()
  }

  private canLoadOrActivate(): Observable<boolean> {
    return this.authService.isUserLoggedIn$
      .pipe(
        withLoading(this),
        tap(value => !value && this.router.navigate([loginRouter]))
      )
  }
}

