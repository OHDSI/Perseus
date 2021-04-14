import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { loginRouter } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class LinkExpiredGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const linkTypes = [
      'email',
      'password'
    ]
    const linkType = state.root.queryParams['linkType']
    if (linkType && linkTypes.includes(linkType)) {
      return true
    }

    this.router.navigate([loginRouter])
    return false
  }
}
