import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { loginRouter } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuardGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (!!state.root.queryParams['token']) {
      return true
    }

    this.router.navigate([loginRouter])
    return false
  }
}
