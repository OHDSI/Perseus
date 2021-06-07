import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { loginRouter } from '@app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AlreadyRegisteredGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!!state.root.queryParams['email']) {
      return true
    }

    this.router.navigate([loginRouter])
    return false
  }

}
