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
import { loginRouter, mainPageRouter } from '@app/app.constants';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {
  private loader$ = new BehaviorSubject<boolean>(false);

  errorMessage: string | null = null

  get loading$(): Observable<boolean> {
    return this.loader$.asObservable()
  }

  constructor(private router: Router,
              @Inject(authInjector) private authService: AuthService) {}

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
            catchError(() => {
              if (this.router.url.includes(mainPageRouter)) {
                return this.authService.refreshToken().pipe(map(res => !!res))
              } else {
                this.errorMessage = 'Auth failed'
                return of(false)
              }
            }),
            tap(value => {
              if (!value) {
                this.router.navigate([loginRouter])
              } else {
                this.errorMessage = null
              }
            }),
            finalize(() => this.loader$.next(false))
        )
  }
}

