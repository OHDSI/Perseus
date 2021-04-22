import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { authInjector } from './auth-injector';
import { AuthService } from './auth.service';
import { mainPageRouter } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInGuard implements CanActivate {

  constructor(private router: Router,
              @Inject(authInjector) private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isUserLoggedIn) {
      this.router.navigateByUrl(`${mainPageRouter}/comfy`)
      return false
    }

    return true
  }
}
