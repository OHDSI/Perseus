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
import { Observable, Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

  private loader$ = new Subject<boolean>();
  loading = false

  constructor(private router: Router,
              @Inject(authInjector) private authService: AuthService) {
    this.loader$
      .pipe(
        debounceTime(300)
      )
      .subscribe(value => this.loading = value)
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
    this.loader$.next(true)
    return this.authService.isUserLoggedIn$
      .pipe(
        tap(() => this.loader$.next(false)),
        tap(value => !value && this.router.navigate([loginRouter]))
      )
  }
}

