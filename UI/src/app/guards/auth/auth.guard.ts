import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { authInjector } from '../../services/auth/auth-injector';
import { loginRouter } from '../../app.constants';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(private router: Router,
              @Inject(authInjector) private authService: AuthService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.canLoadOrActivate()
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canLoadOrActivate()
  }

  private canLoadOrActivate(): boolean {
    if (this.authService.isUserLoggedIn) {
      return true
    }

    this.router.navigate([loginRouter])
    return false
  }
}

