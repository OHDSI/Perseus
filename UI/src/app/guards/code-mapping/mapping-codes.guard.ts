import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ImportCodesService } from '../../services/import-codes/import-codes.service';
import { codesRouter, mainPageRouter } from '../../app.constants';

@Injectable()
export class MappingCodesGuard implements CanActivate {

  constructor(private importCodesService: ImportCodesService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.importCodesService.codeMappings?.length > 0) {
      return true
    } else {
      this.router.navigateByUrl(mainPageRouter + codesRouter)
      return false
    }
  }
}
