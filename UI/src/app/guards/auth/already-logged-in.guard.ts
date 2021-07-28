import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { authInjector } from '@services/auth/auth-injector';
import { AuthService } from '@services/auth/auth.service';
import { mainPageRouter } from '@app/app.constants';

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
