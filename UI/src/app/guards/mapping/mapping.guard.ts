import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { StoreService } from '@services/store.service';
import { mainPageRouter } from '@app/app.constants';

@Injectable()
export class MappingGuard implements CanLoad {

  constructor(private storeService: StoreService,
              private router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this.storeService.state.target?.length > 0) {
      return true
    }

    this.router.navigateByUrl(`${mainPageRouter}/comfy`)
    return false
  }
}
