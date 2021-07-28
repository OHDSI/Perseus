import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { StoreService } from '@services/store.service';
import { mainPageRouter } from '@app/app.constants';
import { canOpenMappingPage } from '@utils/mapping-util';

@Injectable()
export class MappingGuard implements CanLoad, CanActivate {

  constructor(private storeService: StoreService,
              private router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.canLoadOrActivate()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canLoadOrActivate()
  }

  private canLoadOrActivate(): boolean {
    const {target, targetConfig} = this.storeService.state
    const targetTableNames = target.map(table => table.name)
    if (canOpenMappingPage(targetTableNames, targetConfig)) {
      return true
    }

    this.router.navigateByUrl(`${mainPageRouter}/comfy`)
    return false
  }
}
